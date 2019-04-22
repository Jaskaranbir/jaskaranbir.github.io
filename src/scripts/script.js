// TODO: Refactor this potato code

let isMobileDevice;

const $window = $(window);
let windowHeight = $window.height();

const $navBar = $('#nav');
const $navBarList = $navBar.find('ul');
const $navBarItem = $navBar.find('li');
const $menuContainer = $('#menu-container');
const $navTriangles = $('.nav-triangle');
const $initials = $('.initials');
const $projectDesc = $('#project-desc');

const canvases = [].slice.call(document.getElementsByClassName('edu-course-canvas'));
const canvasScale = canvases[0].width;
const canvasCenter = canvasScale / 2;
const completeRadian = Math.PI * 2;
let carouselOffset = 0;
let projectDescOffset = 0;

$window.on('beforeunload', () => {
  $window.scrollTop(0);
});

// ==> The setTimeout functions are not nested to maintain independent behaviour
// ==> (so changing a time of one setTimeout won't affect others)

(() => {
  $('#greeting').hide().fadeIn(2000).delay(100).animate({
    'font-size': '3vh',
    'margin-top': '0',
    'height': '10vh'
  }, 1000, () => {
    $('#greeting').css({
      'position': 'relative',
      'left': '0',
      'top': '50%',
      '-webkit-transform': 'translate(0; -50%)',
      'transform': 'translate(0, -50%)'
    });
    $('#iam-text').append(', I am').hide().delay(300).fadeIn(1000);
  });

  $('.skill-dist-line').height($('#skills-content').height() + (2 * $('.skill-progress').height()));

  setNav();
  isMobileDevice = $window.width() < 700 || $window.height() < 600;

  if ($initials.height() !== $initials.width()) $initials.width($initials.height());

  setTimeout(() => {
    $('#design-text').css('border-right', '2px solid white');
    "Design".split('').forEach((y, i) => {
      setTimeout(() => {
        $('#design-text').append(y);
      }, i * 100);
    });
  }, 6400);

  setTimeout(() => {
    $('#design-text').css('border-right', 'none');
    $('#and-text-mask').show();
    $('#and-text').show().animate({
      'width': '1.9em'
    });
  }, 7000);

  const $codeText = $('#code-text');

  setTimeout(() => {
    "Code".split('').forEach((y, i) => {
      setTimeout(() => {
        $codeText.append(`<span style = "background-color: white; color: black">${y}</span>`);
        if (i > 0) $codeText.children('span').eq(i - 1).css({
          'background-color': 'transparent',
          'color': 'white'
        });
      }, i * 100);
    });

    setTimeout(() => {
      $codeText.children('span').eq(3).css({
        'background-color': 'transparent',
        'color': 'white'
      });
    }, 410);
  }, 7400);

  $('#skip-button').click(() => {
    $('#header-space').dequeue();
  });

  $('#header-space').delay(8500).animate({
    'height': '50vh'
  }, 1400, () => {
    $navBarList.css('margin-top', '0');
    $initials.css('top', '0');
    $('body').css('overflow', 'auto');
    $('#skip-button').remove();
    projectDescOffset = $projectDesc.offset().top + $projectDesc.height() / 2;

    setTimeout(() => {
      $('#about-desc').addClass('fadeout');

      setTimeout(() => {
        $('#about-desc').text('I make stuff.').removeClass('fadeout').addClass('fadein');
      }, 2000);
    }, 1000);

    $window.scrollTop(1);
    $('#projects-scroller').height($('#projects-carousel').find('img').eq(0).outerHeight());
  });

  const $projectsText = $('#projects-text');
  const $projectsTagLine = $('#projects-tagline-text');
  if ($projectsText.offset().top + $projectsText.height() > $projectsTagLine.offset().top + $projectsTagLine.height())
    $projectsTagLine.attr('y', '55.6%');

  setWindowScrollEvents();
  setWindowResizeEvents();
})();

function setWindowScrollEvents () {
  const $header = $('#header-content');

  let projectDescFixed = false;
  let hasScrolled = false;
  let scrollPoint = 0;
  let bottomScroll = 0;

  $window.scroll(() => {
    scrollPoint = $window.scrollTop();

    if (projectDescFixed && bottomScroll > projectDescOffset + $projectDesc.height() / 1.3 || bottomScroll < projectDescOffset - $projectDesc.height() / 2) {
      $projectDesc.removeClass('project-desc-fixed');
      $projects.removeClass('bottom-padding');
      projectDescFixed = false;
    }

    const scrollOpacity = scrollPoint / 350;
    if (scrollOpacity < 1.1) $header.css({
      'opacity': 1 - scrollOpacity,
      '-webkit-transform': `scale(${1 - scrollPoint / 1100})`,
      'transform': `scale(${1 - scrollPoint / 1100})`,
      'margin-top': `${$header.css('margin-top') + scrollPoint / 8}px`
    });

    hasScrolled = true;
  });

  const $sectionDivs = $('.section-div');
  const $wrapper = $('#wrapper');
  var $projects = $('#projects');

  let changeNavColor = false;
  let eduAnimDone = false;
  let skillAnimDone = false;
  let scrollAnimsDone = false;
  let lastScrollPoint = 0;

  setInterval(() => {
    if (!hasScrolled) return;
    hasScrolled = false;

    if (scrollPoint < $wrapper.offset().top) {
      $navBar.removeClass('nav-alt-color');
      $initials.removeClass('initials-alt');
      changeNavColor = true;
    } else if (changeNavColor) {
      $navBar.addClass('nav-alt-color');
      $initials.addClass('initials-alt');
      changeNavColor = false;
    }

    if (!scrollAnimsDone) {
      if (!eduAnimDone) doEducationAnimation(bottomScroll);
      else if (!skillAnimDone) doSkillAnimation(bottomScroll);
      else doProjectsAnimation(bottomScroll);
    }

    const scrollDelta = scrollPoint - lastScrollPoint;

    if (scrollDelta > 40) {
      $navBar.css('top', '-80px');
      $navBarList.css('margin-top', '-80px');
    } else if (scrollDelta < 0) {
      $navBar.css('top', '0');
      $navBarList.css('margin-top', '0');
    }

    lastScrollPoint = scrollPoint;

    bottomScroll = scrollPoint + windowHeight;
    if (!isMobileDevice && !projectDescFixed && bottomScroll > projectDescOffset && bottomScroll < projectDescOffset + $projectDesc.height() / 2) {
      $projectDesc.addClass('project-desc-fixed');
      $projects.addClass('bottom-padding');
      projectDescFixed = true;
    }

    $sectionDivs.each((i, e) => {
      const $e = $(e);
      const topOffset = $e.offset().top;

      if (scrollPoint + windowHeight / 2 >= topOffset - 100 && scrollPoint + windowHeight / 2 < topOffset + $e.height()) {
        $navBarItem.eq(i).css('border-bottom-color', 'white');

        if (!isMobileDevice)
          $navTriangles.eq(i).css('opacity', '1');
      } else {
        $navBarItem.eq(i).css('border-bottom-color', 'transparent');
        if (!isMobileDevice)
          $navTriangles.eq(i).css('opacity', '0');
      }

      $menuContainer.addClass('height0');
    });
  }, 250);

  const $eduCourseGrade = $('.edu-course-grade');
  const $skillBars = $('.skill-progressbar');
  const skillBarCount = $skillBars.length - 1;
  let canvasIndexOffset = 0;
  const canvasesCount = canvases.length;

  function doEducationAnimation (bottomScroll) {

    while (canvasIndexOffset < canvasesCount && bottomScroll > $(canvases[0]).offset().top)
      (() => {
        const context = canvases[0].getContext('2d');
        const end = $eduCourseGrade.eq(canvasIndexOffset).data('number') + 0.01;
        let cur = 0;
        let accel = 0.001;
        context.lineWidth = 8;

        (function animate (curr, stop) {
          context.clearRect(0, 0, canvasScale, canvasScale);

          context.strokeStyle = 'rgba(0,0,0,0.15)';
          context.beginPath();
          context.arc(canvasCenter, canvasCenter, 25, 0, curr * completeRadian, true);
          context.stroke();
          context.closePath();

          context.strokeStyle = '#ED5446';
          context.beginPath();
          context.arc(canvasCenter, canvasCenter, 25, 0, curr * completeRadian, false);
          context.stroke();
          context.closePath();

          if (stop) return;

          requestAnimationFrame(() => cur <= end ? animate(cur) : animate(end, true));

          cur += accel;
          accel += 0.002;
        })();

        canvasIndexOffset++;
        canvases.splice(0, 1);

        if (canvasIndexOffset === canvasesCount) eduAnimDone = true;
      })();
  }

  function doSkillAnimation (bottomScroll) {
    $skillBars.each((i, e) => {
      if (bottomScroll <= $(e).offset().top) return;
      $(e).addClass(`width${$(e).data('progress')}`);
      if (i === skillBarCount) skillAnimDone = true;
    });
  }

  function doProjectsAnimation (bottomScroll) {
    if (bottomScroll > $('#projects-text-svg').offset().top + $('#projects-text-svg').outerWidth() / 1.5) {
      $('#cir1').addClass('stroke-circle');
      $('#cir2').addClass('pop-circle');
      $('#projects-text').addClass('text-outline');
      $('#projects-tagline-text').addClass('semi-text-fadein');
      scrollAnimsDone = true;
    }
  }
}

function setWindowResizeEvents () {
  $window.on('resize', () => {
    $('.skill-dist-line').height($('#skills-content').height() + (2 * $('.skill-progress').height()));

    setTimeout(() => {
      $('#projects-scroller').height($('#projects-carousel img').eq(-carouselOffset).outerHeight());

      setTimeout(() => {
        projectDescOffset = $projectDesc.offset().top + $projectDesc.height() / 2;
      }, 600);
    }, 800);

    if ($initials.height() != $initials.width()) $initials.width($initials.height());
    isMobileDevice = $window.width() < 700 || $window.height() < 600;

    windowHeight = $window.height();
  });
}

function setNav () {
  const navbarHeight = $navBar.height();
  $navBarItem.each((i, e) => {
    $(e).on('click', () => {
      $('html, body').animate({
        scrollTop: $(`#${$(e).data('anchor')}`).offset().top - navbarHeight
      }, 1000);
    });
  });

  $initials.on('click', () => {
    $menuContainer.toggleClass('height0');
  });

  setEducation();
}

function setEducation () {
  canvases.forEach(e => {
    const context = e.getContext('2d');
    context.lineWidth = 8;
    context.beginPath();
    context.strokeStyle = 'rgba(0,0,0,0.15)';
    context.arc(canvasCenter, canvasCenter, 25, 0, completeRadian);
    context.stroke();
    context.closePath();
  });

  setProjects();
}

function setProjects () {
  const $projectAttr = $('.project-attr');
  const $projectName = $('.project-name');
  const $projectAttrDiv = $('.project-attr-div').add($projectName);
  const $leftScrollButton = $('.carousel-scroll-button.stick-left');
  const $rightScrollButton = $('.carousel-scroll-button.stick-right');
  const $carouselContainer = $('#projects-carousel-container');
  const $carouselContChild = $carouselContainer.children();

  $leftScrollButton.text('> |').css('letter-spacing', '-1vh');

  const projectInfo = [
    [
      ['Capstone Project'],
      ['Golang, Angular'],
      [
        'Event-Sourcing | CQRS | Cassandra | MongoDB | Kafka | ' +
        'Kubernetes | Docker | Ansible | Packer | TravisCI'
      ],
      ['Inventory-tracking and monitoring food-health using IOT sensors'],
      ['#']
    ],
    [
      ['Agar.io Clone'],
      ['Java, JavaScript'],
      [
        'Vagrant | Docker | CSS | HTML | JavaEE | Javascript | ' +
        'JSP/JSTL | MySQL | React.js | Websockets | Webpack | Maven | TravisCI'
      ],
      ['A simple Agar.io (online realtime MMO) clone developed using WebSocket and HTML on java.'],
      ['https://github.com/Jaskaranbir/Agar.io-Clone']
    ],
    [
      ['InstaPost'],
      ['C#, JavaScript'],
      [
        'Vagrant | Docker | .NET Core | Entity Framework | ' +
        'React.js | SQL Server | MongoDB | Webpack | TravisCI'
      ],
      ['A simple social media platform.'],
      ['https://github.com/Jaskaranbir/InstaPost']
    ],
    [
      ['Super Mario'],
      ['Java'],
      ['JavaFX'],
      ['A clone of first level of the classic NES Super Mario Bros with some added flavour of Dragon Ball Z anime. Made using JavaFX.'],
      ['https://github.com/Jaskaranbir/Super-Mario']
    ],
    [
      ['MySQL-GUI'],
      ['Java'],
      ['Spring Framework | JDBC | Maven | Swing'],
      ['A basic MySQL GUI created in java. Allows few functions such as dynamically adding/removing data, tables and databases along with ability to modify the existing data.'],
      ['https://github.com/Jaskaranbir/MySQL_GUI']
    ],
    [
      ['Jeopardy'],
      ['Java'],
      ['Servlets'],
      ['Jeopardy developed using java servlets in MVC Architecture.'],
      ['https://github.com/Jaskaranbir/Jeopardy_Java-Servlets']
    ]
  ];

  function updateProjectInfo () {
    $projectAttr.each(i => {
      const curProjectInfo = projectInfo[-carouselOffset];
      $projectName.eq(i).parent().attr('href', curProjectInfo[4]);
      return fadeTransformText($projectAttr.eq(i), curProjectInfo[i]);
    });

    function fadeTransformText ($element, text) {
      $projectAttrDiv.removeClass('fadein-fast').addClass('fadeout-fast');

      setTimeout(() => {
        $element.text(text);
        $projectAttrDiv.removeClass('fadeout-fast').addClass('fadein-fast');
      }, 500);
    }
  }

  updateProjectInfo();

  const carouselCount = $carouselContChild.length;
  const translateOffset = 100 / carouselCount;

  $('.stick-left').click(() => {
    switch (++carouselOffset) {
      case 0:
        setTimeout(() => {
          $leftScrollButton.text('> |').css('letter-spacing', '-1vh');
        }, 800);
        break;

      case 1:
        carouselOffset = -carouselCount + 1;
        setTimeout(() => {
          $rightScrollButton.text('| <').css('letter-spacing', '-1vh');
        }, 800);
      default:
        setTimeout(() => {
          $leftScrollButton.text('<<').css('letter-spacing', '-1.5vh');
        }, 800);
    }

    updateProjectInfo();

    $rightScrollButton.text('>>').css('letter-spacing', '-1.5vh');

    $carouselContainer.css({
      '-webkit-transform': `translateX(${translateOffset * carouselOffset}%)`,
      'transform': `translateX(${translateOffset * carouselOffset}%)`
    });
    $carouselContChild.eq(carouselOffset === (-carouselCount - 1) ? 0 : -carouselOffset + 1).find('img').addClass('carousel-img-width-alt');
    $carouselContChild.eq(-carouselOffset).find('img').removeClass('carousel-img-width-alt').addClass('carousel-img-width');
  });

  $('.stick-right').click(() => {
    switch (--carouselOffset) {
      case (-carouselCount + 1):
        setTimeout(() => {
          $rightScrollButton.text('| <').css('letter-spacing', '-1vh');
        }, 800);
        break;

      case (-carouselCount):
        carouselOffset = 0;
        setTimeout(() => {
          $leftScrollButton.text('> |').css('letter-spacing', '-1vh');
        }, 800);
      default:
        setTimeout(() => {
          $rightScrollButton.text('>>').css('letter-spacing', '-1.5vh');
        }, 800);
    };

    updateProjectInfo();

    $leftScrollButton.text('<<').css('letter-spacing', '-1.5vh');

    $carouselContainer.css({
      '-webkit-transform': `translateX(${translateOffset * carouselOffset}%)`,
      'transform': `translateX(${translateOffset * carouselOffset}%)`
    });
    $carouselContChild.eq(-carouselOffset - 1).find('img').addClass('carousel-img-width-alt');
    $carouselContChild.eq(-carouselOffset).children(0).find('img').removeClass('carousel-img-width-alt').addClass('carousel-img-width');
  });

  setContact();
}

function setContact () {
  ['name', 'email', 'subject', 'message'].forEach(e => $(`#contact-${e}`).on('input', () => $(`#contact-${e}-label`).toggleClass('fadein-bottom', !!$(`#contact-${e}`).val())));

  let mailSuccess = false;
  const $contactStatus = $('#contact-status');

  $('#contact-send').click(e => {
    e.preventDefault();
    if (mailSuccess)
      return;

    $.ajax({
      url: "////formspree.io/jaskaranbir_singh@ymail.com",
      method: 'POST',
      data: $('#contact-form-container').serializeArray(),
      dataType: 'json',

      success () {
        $('#contact-send').addClass('contact-button-finalize');
        $contactStatus.text('Mail Sent Successfully');
        mailSuccess = true;
        return;
      },

      error () {
        $contactStatus.text('An Error Occurred. Please make sure the email you entered is valid. You may also want to contact me directly on my email: dhjaskar@sheridancollege.ca');
      }

    });
  });
}
