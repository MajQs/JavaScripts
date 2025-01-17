 setTimeout(function() {
   var captcha = $('#bot_check')
   if ($(captcha).length > 0) {
     $(captcha).find('a').first().click()
   }
 }, 5000);