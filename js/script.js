/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {


// To understand behaviors, see https://drupal.org/node/756722#behaviors
Drupal.behaviors.my_custom_behavior = {
  attach: function(context, settings) {

    // Place your code here.

  }
};


function autofill(){
  var $title = jQuery('#edit-title'),
      $address = jQuery('#edit-locations-0-street'),
      $additional = jQuery('#edit-locations-0-additional')
      $state = jQuery('#edit-locations-0-province'),
      $city = jQuery('#edit-locations-0-city'),
      $phone = jQuery('#edit-locations-0-phone'),
      $link = jQuery('#edit-field-institutution-link-und-0-url'),
      $iframe = jQuery('#cke_contents_edit-body-und-0-value iframe').contents().find('body p');
  

  var address = '', additional = '', city = '', state = '', zip = '', phone = '', title = '', link = '';
  var $values = $iframe.find('a, span'), l = $values.length;
  var $remove_after = jQuery();
  for (var i = 0; i<l; i++) {
    var val = $values.eq(i), text = val.text();
    if (i==0) {//first element to show up should be title.
      title = text;
      link = val.attr('href') || '';//if available...
      $remove_after = $remove_after.add(val);
      var next = val.next();
      if (next.is('br')) $remove_after = $remove_after.add(next);
    }else if (text){
      if(/^([0-9]+ [a-zA-Z]+.+)$/.test(text)) {//address: 123 place walk
        address = text;
        $remove_after = $remove_after.add(val);
        var next = val.next();
        if (next.is('br')) $remove_after = $remove_after.add(next);
      }else if (/^([a-zA-Z ]+, [A-Z][A-Z] [0-9\-]+)$/.test(text)) {//city, state zip
        var split = text.split(/^([a-zA-Z ]+), ([A-Z][A-Z]) ([0-9\-]+)$/);
        if (split.length==5) {
          city = split[1]
          state = split[2];
          zip = split[3];
          $remove_after = $remove_after.add(val);
          var next = val.next();
          if (next.is('br')) $remove_after = $remove_after.add(next);
        }else{
          console.log('WARNING: error city, state, zip line: ', text);
        }
      }else if (/^\(?[0-9]{3}[\- )] ?[0-9]{3}[ -][0-9]{4}$/.test(text)) {//looks like an address
        var split = text.split(/^\(?([0-9]{3})[\- )] ?([0-9]{3})[ -]([0-9]{4})$/);
        if (split.length==5) {
          phone = "("+split[1]+") "+split[2]+"-"+split[3];
          $remove_after = $remove_after.add(val);
          var next = val.next();
          if (next.is('br')) $remove_after = $remove_after.add(next);
        }
      }else if (/^P.?O.? Box [0-9]+.*$/i.test(text)) {
        var split = text.split(/^(P.?O.? Box [0-9]+),?(.*)$/i);
        if (split.length == 4) {
          additional = split[1];
          if (split[2])//address is inline
            address = split[2];
            $remove_after = $remove_after.add(val);
            var next = val.next();
            if (next.is('br')) $remove_after = $remove_after.add(next);
        }else{
          console.log('WARNING: error parsing PO Box line: ', text)
        }
      }
    }
  }
  
  if (!address && additional) {
    address = additional;
    additional = '';
  }
  
  $title.val(title);
  $address.val(address);
  $additional.val(additional);
  $state.val(state);
  $city.val(city);
  $phone.val(phone);
  $link.val(link);
  
  $remove_after.remove();
}


if ($('#institution-node-form').length) {//on the institution form.
  $('<a>').html('Auto-fill fields (BETA)').attr('href', '#').on('click', function(){
    autofill();
  }).attachTo($('.form-item form-type-textarea.form-item-body-und-0-value label'));
}

})(jQuery, Drupal, this, this.document);
