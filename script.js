'use strict';

var isMobileDevice;

var $window = $(window);
var $navBar = $('#nav');
var $navBarItem = $navBar.find('li');
var $navTriangles = $('.nav-triangle');
var $initials = $('.initials');
var $header = $('#header-content');
var $wrapper = $('#wrapper');
var $sectionDivs = $('.section-div');
var $projects = $('#projects');
var $projectDesc = $('#project-desc');

var changeNavColor = true;

var canvases = [].slice.call(document.getElementsByClassName('edu-course-canvas'));
var canvasesCount = canvases.length;
var canvasScale = canvases[0].width;
var canvasCenter = canvasScale / 2;
var completeRadian = Math.PI * 2;
var canvasIndexOffset = 0;

var eduAnimDone = false;
var skillAnimDone = false;
var projectsAnimDone = false;
var carouselOffset = 0;
var projectDescOffset = 0;
var projectDescFixed = false;
var scrollAnimsDone = false;

$window.scroll(function () {
    var scrollPoint = $window.scrollTop();

    $sectionDivs.each(function (i, e) {
        if (scrollPoint + $window.height() / 2 >= $(e).offset().top - 100 && scrollPoint + $window.height() / 2 < $(e).offset().top + $(e).height()) {
            $navBarItem.eq(i).css('border-bottom-color', 'white');
            $navTriangles.eq(i).css('opacity', '1');

            $navBarItem.eq(i - 1).css('border-bottom-color', 'transparent');
            $navTriangles.eq(i - 1).css('opacity', '0');
            $navBarItem.eq(i + 1).css('border-bottom-color', 'transparent');
            $navTriangles.eq(i + 1).css('opacity', '0');

            $('#menu-container').addClass('height0');
        }
    });

    var scrollOpacity = scrollPoint / 350;
    if (scrollOpacity < 1.1) $header.css({
        'opacity': 1 - scrollOpacity,
        'transform': 'scale(' + (1 - scrollPoint / 1100) + ')',
        'margin-top': $header.css('margin-top') + scrollPoint / 8 + 'px'
    });

    if (scrollPoint > $wrapper.offset().top) {
        $navBar.css({
            'background-color': 'black'
        });

        $initials.addClass('initials-alt');

        changeNavColor = true;
    } else if (changeNavColor) {
        $navBar.css('background-color', 'transparent');

        $initials.removeClass('initials-alt');

        changeNavColor = false;
    }

    if (scrollAnimsDone) return;

    var bottomScroll = scrollPoint + $window.height();

    if (!eduAnimDone) doEducationAnimation(bottomScroll);

    else if (!skillAnimDone) doSkillAnimation(bottomScroll);

    else if (!projectsAnimDone) doProjectsAnimation(bottomScroll);
    
    if (isMobileDevice) return;

    else if (!projectDescFixed && bottomScroll > projectDescOffset && bottomScroll < projectDescOffset + $projectDesc.height() / 2) {
        $projectDesc.addClass('project-desc-fixed');
        $projects.addClass('bottom-padding');
        projectDescFixed = true;
    } else if (projectDescFixed && bottomScroll > projectDescOffset + $projectDesc.height() / 1.3 || bottomScroll < projectDescOffset - $projectDesc.height() / 2) {
        $projectDesc.removeClass('project-desc-fixed');
        $projects.removeClass('bottom-padding');
        projectDescFixed = false;
    }
});

function doEducationAnimation(bottomScroll) {
    var $eduCourseGrade = $('.edu-course-grade');

    var _loop = function _loop() {

        var context = canvases[0].getContext('2d');
        var end = $eduCourseGrade.eq(canvasIndexOffset).data('number') + 0.01;
        var cur = 0;
        var accel = 0.001;
        context.lineWidth = 8;

        (function animate(curr, stop) {
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

            requestAnimationFrame(function () {
                return cur <= end ? animate(cur) : animate(end, true);
            });

            cur += accel;
            accel += 0.002;
        })();

        canvasIndexOffset++;
        canvases.splice(0, 1);

        if (canvasIndexOffset === canvasesCount) eduAnimDone = true;
    };

    while (canvasIndexOffset < canvasesCount && bottomScroll > $(canvases[0]).offset().top) {
        _loop();
    }
}

function doSkillAnimation(bottomScroll) {
    $('.skill-progressbar').each(function (i, e) {
        if (bottomScroll <= $(e).offset().top) return;
        $(e).addClass('width' + $(e).data('progress'));
        if (i === 10) skillAnimDone = true;
    });
}

function doProjectsAnimation(bottomScroll) {
    if (bottomScroll > $('#projects-text-svg').offset().top + $('#projects-text-svg').outerWidth() / 1.5) {
        $('#cir1').addClass('stroke-circle');
        $('#cir2').addClass('pop-circle');
        $('#projects-text').addClass('text-outline');
        $('#projects-tagline-text').addClass('semi-text-fadein');
        projectsAnimDone = true;
        scrollAnimsDone = true;
    }
}

$window.on('resize', function () {
    $('.skill-dist-line').height($('#skills-content').height() - $('.skill-extra').height() + $('.skill-progress').height());

    setTimeout(function () {
        $('#projects-scroller').height($('#projects-carousel img').eq(-carouselOffset).outerHeight());

        setTimeout(function () {
            projectDescOffset = $projectDesc.offset().top + $projectDesc.height() / 2;
        }, 600);
    }, 800);

    if ($initials.height() != $initials.width()) $initials.width($initials.height());
    isMobileDevice = $window.width() < 700 || $window.height() < 600;
});

$window.on('beforeunload', function () {
    $window.scrollTop(0);
});

(function () {
    $('#greeting').hide().fadeIn(2000).delay(100).animate({
        'font-size': '3vh',
        'margin-top': '0',
        'height': '10vh'
    }, 1000, function () {
        $('#greeting').css({
            'position': 'relative',
            'left': '0',
            'top': '50%',
            'transform': 'translate(0, -50%)'
        });
        $('#iam-text').append(', I am').hide().delay(300).fadeIn(1000);
    });

    $('.skill-dist-line').height($('#skills-content').height() - $('.skill-extra').height() + $('.skill-progress').height());

    setNav();
    isMobileDevice = $window.width() < 700 || $window.height() < 600;

    if ($initials.height() != $initials.width()) $initials.width($initials.height());

    setTimeout(function () {
        $('#design-text').css('border-right', '2px solid white');
        "Design".split('').forEach(function (y, i) {
            setTimeout(function () {
                $('#design-text').append(y);
            }, i * 100);
        });
    }, 6400);

    setTimeout(function () {
        $('#design-text').css('border-right', 'none');
        $('#and-text-mask').show();
        $('#and-text').show().animate({
            'width': '1.9em'
        });
    }, 7000);

    setTimeout(function () {
        "Code".split('').forEach(function (y, i) {
            setTimeout(function () {
                $('#code-text').append('<span style = "background-color: white; color: black">' + y + '</span>');
                if (i > 0) $('#code-text').children('span').eq(i - 1).css({
                    'background-color': 'transparent',
                    'color': 'white'
                });
            }, i * 100);
        });

        setTimeout(function () {
            $('#code-text').children('span').eq(3).css({
                'background-color': 'transparent',
                'color': 'white'
            });
        }, 410);
    }, 7400);

    $('#skip-button').click(function () {
        $('#header-space').dequeue();
    });

    $('#header-space').delay(8500).animate({
        'height': '50vh'
    }, 1400, function () {
        $('#nav').find('ul').css('margin-top', '0');
        $('.initials').css('top', '0');
        $('body').css('overflow', 'auto');
        $('#skip-button').remove();
        projectDescOffset = $projectDesc.offset().top + $projectDesc.height() / 2;

        setTimeout(function () {
            $('#about-desc').addClass('fadeout');

            setTimeout(function () {
                $('#about-desc').text('I make and screw with stuff.').removeClass('fadeout').addClass('fadein');
            }, 2000);
        }, 1000);

        var bottomScroll = $window.scrollTop() + $window.height();
        doEducationAnimation(bottomScroll);
        doSkillAnimation(bottomScroll);
    });

    var $projectsTagLine = $('#projects-tagline-text');
    if ($('#projects-text').offset().top + $('#projects-text').height() > $projectsTagLine.offset().top + $projectsTagLine.height())
        $projectsTagLine.attr('y', '55.6%');
})();

function setNav() {
    var navbarHeight = $navBar.height();
    $('#nav').find('li').each(function (i, e) {
        $(e).on('click', function () {
            $('html, body').animate({
                scrollTop: $('#' + $(e).data('anchor')).offset().top - navbarHeight
            }, 1000);
        });
    });

    $initials.on('click', function () {
        $('#menu-container').toggleClass('height0');
    });

    setEducation();
}

function setEducation() {
    canvases.forEach(function (e) {
        var context = e.getContext('2d');
        context.lineWidth = 8;
        context.beginPath();
        context.strokeStyle = 'rgba(0,0,0,0.15)';
        context.arc(canvasCenter, canvasCenter, 25, 0, completeRadian);
        context.stroke();
        context.closePath();
    });

    setProjects();
}

function setProjects() {
    var $projectAttr = $('.project-attr');
    var $projectAttrDiv = $('.project-attr-div, .project-name');
    var $leftScrollButton = $('.carousel-scroll-button.stick-left');
    var $rightScrollButton = $('.carousel-scroll-button.stick-right');
    var $carouselContainer = $('#projects-carousel-container');
    var $carouselContChild = $carouselContainer.children();

    $('#projects-scroller').height($('#projects-carousel').find('img').eq(-carouselOffset).outerHeight());
    $leftScrollButton.text('> |').css('letter-spacing', '-1vh');

    var projectInfo = [[['Super Mario'], ['Java'], ['JavaFX'], ['A simple clone of first level of the classic NES Super Mario Bros with some added flavour of Dragon Ball Z anime. Made using pure JavaFX.']], [['MySQL-GUI'], ['Java'], ['Spring Framework | JDBC | Maven | Swing'], ['A basic MySQL GUI created in java. Allows few functions such as dynamically adding/removing data, tables and databases along with ability to modify the existing data.']], [['Falling Robots'], ['Java'], ['Becker Robots'], ['A simple java game created using basic multi-threading in which robots fall from top to bottom and player has to catch them.']]];

    function updateProjectInfo() {
        $projectAttr.each(function (i) {
            return fadeTransformText($projectAttr.eq(i), projectInfo[-carouselOffset][i]);
        });

        function fadeTransformText($element, text) {
            $projectAttrDiv.removeClass('fadein-fast').addClass('fadeout-fast');

            setTimeout(function () {
                $element.text(text);
                $projectAttrDiv.removeClass('fadeout-fast').addClass('fadein-fast');
            }, 500);
        }
    }

    updateProjectInfo();

    $('.stick-left').click(function () {
        switch (++carouselOffset) {
            case 0:
                setTimeout(function () {
                    $leftScrollButton.text('> |').css('letter-spacing', '-1vh');
                }, 800); break;

            case 1:
                carouselOffset = -2;
                setTimeout(function () {
                    $rightScrollButton.text('| <').css('letter-spacing', '-1vh');
                }, 800);
            default:
                setTimeout(function () {
                    $leftScrollButton.text('<<').css('letter-spacing', '-1.5vh');
                }, 800);
        }

        updateProjectInfo();

        $rightScrollButton.text('>>').css('letter-spacing', '-1.5vh');

        $carouselContainer.css('transform', 'translateX(' + 33.33 * carouselOffset + '%)');
        $carouselContChild.eq(carouselOffset === -2 ? 0 : -carouselOffset + 1).children().eq(0).addClass('carousel-img-width-alt');
        $carouselContChild.eq(-carouselOffset).children().eq(0).removeClass('carousel-img-width-alt').addClass('carousel-img-width');
    });

    $('.stick-right').click(function () {
        switch (--carouselOffset) {
            case -2:
                setTimeout(function () {
                    $rightScrollButton.text('| <').css('letter-spacing', '-1vh');
                }, 800); break;

            case -3:
                carouselOffset = 0;
                setTimeout(function () {
                    $leftScrollButton.text('> |').css('letter-spacing', '-1vh');
                }, 800);
            default:
                setTimeout(function () {
                    $rightScrollButton.text('>>').css('letter-spacing', '-1.5vh');
                }, 800);
        };

        updateProjectInfo();

        $leftScrollButton.text('<<').css('letter-spacing', '-1.5vh');

        $carouselContainer.css('transform', 'translateX(' + 33.33 * carouselOffset + '%)');
        $carouselContChild.eq(-carouselOffset - 1).children().eq(0).addClass('carousel-img-width-alt');
        $carouselContChild.eq(-carouselOffset).children().eq(0).removeClass('carousel-img-width-alt').addClass('carousel-img-width');
    });

    setContact();
}

function setContact() {
    ['name', 'phone', 'email', 'message'].forEach(function (e) {
        return $('#contact-' + e).on('input', function () {
            return $('#contact-' + e + '-label').toggleClass('fadein-bottom', !!$('#contact-' + e).val());
        });
    });
}
