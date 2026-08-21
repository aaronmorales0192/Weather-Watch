// Precipitation diagram: tab switching + animated falling particles,
// plus an ice-buildup effect on the ground for Freezing Rain.
//
// Each precip type has a set of "boundaries" describing what the falling
// particle looks like at each point in its descent (0% = cloud, 100% =
// ground). A boundary segment can use either an emoji (`emoji: '❄️'`) or
// a custom image (`image: 'sleet.png'`) — the particle swaps between them
// automatically as it crosses each boundary.

const PRECIP_CONFIG = {
  'snow': {
    duration: 3200,
    boundaries: [
      { upTo: 100, emoji: '❄️' }
    ]
  },
  'sleet': {
    duration: 3200,
    boundaries: [
      { upTo: 30, emoji: '❄️' },
      { upTo: 60, emoji: '💧' },
      { upTo: 100, image: 'sleet.png' }
    ]
  },
  'freezing-rain': {
    duration: 3200,
    boundaries: [
      { upTo: 20, emoji: '❄️' },
      { upTo: 100, emoji: '💧' }
    ]
  },
  'rain': {
    duration: 3200,
    boundaries: [
      { upTo: 15, emoji: '❄️' },
      { upTo: 100, emoji: '💧' }
    ]
  }
};

const MAX_ICE_MARKS = 14;
const LANDING_PERCENT = 93;

function segmentForPercent(boundaries, percent) {
  for (let i = 0; i < boundaries.length; i++) {
    if (percent <= boundaries[i].upTo) {
      return boundaries[i];
    }
  }
  return boundaries[boundaries.length - 1];
}

// Updates a particle's visible content (emoji text or an <img>), but only
// touches the DOM when the segment actually changes to avoid unnecessary work.
function applySegment(particle, segment) {
  const key = segment.image ? ('image:' + segment.image) : ('emoji:' + segment.emoji);

  if (particle.lastKey === key) return;
  particle.lastKey = key;

  particle.el.innerHTML = '';

  if (segment.image) {
    const img = document.createElement('img');
    img.src = segment.image;
    img.alt = '';
    img.className = 'precip-particle-image';
    particle.el.appendChild(img);
  } else {
    particle.el.textContent = segment.emoji;
  }
}

document.addEventListener('DOMContentLoaded', function () {

  // ---- Tab switching between panels ----
  const buttons = document.querySelectorAll('.precip-btn');
  const panels = document.querySelectorAll('.precip-panel');

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      const target = button.dataset.panel;

      buttons.forEach(function (b) {
        b.classList.toggle('active', b === button);
      });

      panels.forEach(function (panel) {
        panel.classList.toggle('active', panel.dataset.panel === target);
      });
    });
  });

  // ---- Set up falling particles for each panel ----
  const leftPositions = [22, 50, 78]; // percent across the column
  const particleSets = [];

  panels.forEach(function (panel) {
    const type = panel.dataset.panel;
    const config = PRECIP_CONFIG[type];
    const container = panel.querySelector('.precip-particles');
    const iceContainer = panel.querySelector('.precip-ice-marks');

    if (!config || !container) return;

    const particles = leftPositions.map(function (leftPct, i) {
      const el = document.createElement('span');
      el.className = 'precip-particle-emoji';
      el.style.left = leftPct + '%';
      container.appendChild(el);

      return {
        el: el,
        leftPct: leftPct,
        phaseOffset: (config.duration / leftPositions.length) * i,
        hasLanded: false,
        lastKey: null
      };
    });

    particleSets.push({
      type: type,
      config: config,
      particles: particles,
      iceContainer: iceContainer,
      iceMarks: []
    });
  });

  // ---- Spawns a small ice glaze mark on the ground (Freezing Rain only) ----
  function spawnIceMark(set, leftPct) {
    if (!set.iceContainer) return;

    const mark = document.createElement('span');
    mark.className = 'precip-ice-mark';
    mark.style.left = leftPct + '%';
    set.iceContainer.appendChild(mark);
    set.iceMarks.push(mark);

    if (set.iceMarks.length > MAX_ICE_MARKS) {
      const oldest = set.iceMarks.shift();
      if (oldest && oldest.parentNode) {
        oldest.parentNode.removeChild(oldest);
      }
    }
  }

  // ---- Animate all particles continuously ----
  function animate(timestamp) {
    particleSets.forEach(function (set) {
      set.particles.forEach(function (particle) {
        const t = (timestamp + particle.phaseOffset) % set.config.duration;
        const percent = (t / set.config.duration) * 95; // fall from 0% to 95%

        particle.el.style.top = percent + '%';
        applySegment(particle, segmentForPercent(set.config.boundaries, percent));

        // Freezing Rain: ice builds up on the ground each time a drop lands
        if (set.type === 'freezing-rain') {
          if (percent >= LANDING_PERCENT && !particle.hasLanded) {
            spawnIceMark(set, particle.leftPct);
            particle.hasLanded = true;
          } else if (percent < 5) {
            particle.hasLanded = false;
          }
        }
      });
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});