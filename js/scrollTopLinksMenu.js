$(window).on('scroll', function () {
    if ($(window).scrollTop() > 50) {
      $('div.nav-section-above800px').addClass('headeronscrolldown')
      $('nav ul').addClass('ulonscrolldown')
      $('nav img').addClass('logoImageShrink')
      /* NOTE: For class selector make sure you have '.'' */
      $('.topLinks-flex-container').addClass('topLinks-transition')
      /* Remove */
      $('nav img').removeClass('logoImageExpand')
    } else {
      $('div.nav-section-above800px').removeClass('headeronscrolldown')
      $('nav ul').removeClass('ulonscrolldown')
      $('nav img').removeClass('logoImageShrink')
      $('.topLinks-flex-container').removeClass('topLinks-transition')

      /* Add */
      $('nav img').addClass('logoImageExpand')
    }
  })