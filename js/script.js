
alert("hello");


var select_item = '';
var select_price = '+0';
var price = 299;

var item_list = [];

var rectboxX = 130,
    rectboxY = 352,
    rectboxWidth = 215,
    rectboxHeight = 337;

function updatePrice(price_change) {
  var regExp = /(\=|\+|\-)(\d+)/;
  var result, result_sign, result_no;

  /* Use Regular Expression to decide input
     undefined = no change
     '=50' = equal 50 baht
     '+50' = add 50 baht
     '-50' = decrease 50 baht
  */
  if ((result = regExp.exec(price_change)) != null) {
      if (result.index === regExp.lastIndex) {
          regExp.lastIndex++;
      }
      result_sign = result[1];
      result_no = result[2];
  }
  
  if(!result_no) {
    
  } else if (result_sign == '=') {
    price = price_change;
  } else if (result_sign == '+') {
    price += price_change;
  } else if (result_sign == '-') {
    price -= price_change
  }
  
  /* Update Price */
  $('#price').html(price);
}

$(document).ready(function() {
  updatePrice();
  
  $('#boxEdit').show();
  $('#boxEditText, #boxEditImage').hide();
  
  $('.ui.accordion')
    .accordion()
  ;

  $('.ui.dropdown')
    .dropdown()
  ;
  
  $('#libraryButton').on('click', function() {
    select_item = '';
    $('.library.modal')
      .modal('show')
    ;
  });
  
  $('.library').find('.item').on('click', function() {
    $('.item').removeClass('active');
    select_item = $(this).find('img').attr('src');
    select_price = $(this).attr('data-price');
    $(this).addClass('active');
  });
  
  $('#libAddButton').on('click', function() {
    if(select_item === '') return;
    var imgObj = new Image();
    imgObj.src = select_item;
    imgObj.onload = function () {
        // start fabricJS stuff

        var image = new fabric.Image(imgObj);
        image.scale(0.5).set({
            left: 0,
            right: 0
        });
        //image.scale(getRandomNum(0.1, 0.25)).setCoords();
      
        image.on('selected', function() {
          var obJ = canvas.getActiveObject();

          $('#boxEdit, #boxEditText').hide();
          $('#boxEditImage').show();
        });
      
        image.itemPrice = select_price;
      
        item_list.push(image);
        canvas.setActiveObject(image).add(image);

        // end fabricJS stuff
      
        updatePrice(select_price);
    }
  });
  
  var canvas = this.__canvas = new fabric.Canvas('c');
  fabric.Object.prototype.transparentCorners = false;

  var radius = 300;

  fabric.Image.fromURL('https://i.imgur.com/1VNvSnK.png', function(img) {
    img.set({
      left: 0,
      top: 0,
      selectable: false,
      hasControls: false,
      hasBorders: false
    });
    canvas.add(img).setActiveObject(img);
    
    rectbox = new fabric.Rect({
      width: rectboxWidth,
      height: rectboxHeight,
      left: rectboxX,
      top: rectboxY,
      stroke: 'rgba(0,0,0,0.3)',
      strokeWidth: 2,
      fill: 'rgba(0,0,0,0)',
      selectable: false,
      hasControls: false,
      hasBorders: false
    });

    canvas.add(rectbox);
    
    var recttext = new fabric.Text('Printable Area', {
      fontSize: 14,
      fontFamily: 'sans-serif',
      left: 200,
      top: 330,
      fill: 'rgba(0,0,0,0.3)',
      selectable: false,
      hasControls: false,
      hasBorders: false
    });
    
    canvas.add(recttext);
    
    // Create Clip Area (Object created after this will be clipped)
/*    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(rectboxX, rectboxY,rectboxWidth, rectboxHeight);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
    ctx.stroke();
    ctx.clip();*/
    // END Clip Area
  });
  
  $('#addTextButton').on('click', function() {
    var inText = $('#inputText').val();
    
    if(inText.trim() === '') {
      alert('Please type text');
      return;
    }
    
    var inFont = $('#inputFont').val();
    var inSize = 14;
    var inColor = $('#inputColor').val();
    
    var newText = new fabric.Text(inText, {
      fontSize: inSize,
      fontFamily: inFont,
      fill: inColor
    });
    
    newText.on('selected', function() {
      var obJ = canvas.getActiveObject();
      
      // Update Edit Text
      $('#editText').val( obJ.text );
      $('#uiEditFont').dropdown( 'set selected', obJ.fontFamily );
      $('#uiEditFont').dropdown( 'set value', obJ.fontFamily );
      $('#uiEditColor').dropdown( 'set selected', obJ.fill );
      $('#uiEditColor').dropdown( 'set value', obJ.fill );
      
      $('#boxEdit, #boxEditImage').hide();
      $('#boxEditText').show();
    });
    
    canvas.setActiveObject(newText).add(newText);
    
    item_list.push(newText);
  });
  
  $('#updateTextButton').on('click', function() {
    var inText = $('#editText').val();
    
    if(inText.trim() === '') {
      $('.trashButton').trigger('click');
      return;
    }
    
    var inFont = $('#editFont').val();
    var inSize = 14;
    var inColor = $('#editColor').val();
    
    var TexttoEdit = canvas.getActiveObject();
    TexttoEdit.setText(inText)
    .setFontFamily(inFont)
    .setFontSize(inSize)
    .setFill(inColor);
    
    canvas.renderAll();
  });
  
  document.getElementById('imgLoader').onchange = function handleImage(e) {
    
    // Check for available file
    if ($('#imgLoader').val().length < 1) {
      // No file Uploaded
      console.log('No file uploaded');
      return false;
    }
    
    // Check file extensions
    var fileExt = $('#imgLoader').val().split('.').pop().toLowerCase();
    if($.inArray(fileExt, ['png','jpg','jpeg']) == -1) {
        alert('You cannot upload this file. Please upload only .png, .jpg, or .jpeg images.');
        $('#file').val("");
        return false;
    }
    
    var reader = new FileReader();
    reader.onload = function (event) {
        var imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
            // start fabricJS stuff
            
            var image = new fabric.Image(imgObj);
            image.set({
                left: 0,
                right: 0
            });
          
            image.on('selected', function() {
              var obJ = canvas.getActiveObject();

              $('#boxEdit, #boxEditText').hide();
              $('#boxEditImage').show();
            });
          
            //image.scale(getRandomNum(0.1, 0.25)).setCoords();
            canvas.setActiveObject(image).add(image);
          
            item_list.push(image);
            
            // end fabricJS stuff
        }
        
    }
    reader.readAsDataURL(e.target.files[0]);
  }
  
  $('.trashButton').on('click', function() {
    $('#modalDelete').modal('setting', {
      onDeny    : function(){
      },
      onApprove : function() {
        var obJ = canvas.getActiveObject();
        
        // Remove from item_list
        var obJindex = item_list.indexOf(obJ);
        if (obJindex > -1) {
            item_list.splice(obJindex, 1);
        }
        
        // Remove from canvas
        obJ.remove();
        clearSelection();
      }
    }).modal('show');
    
    return false;
  });
  
  $('#resetButton').on('click', function() {
    var iLength = item_list.length;
    for (var i = 0; i < iLength; i++) {
        canvas.remove(item_list[i]);
    }
    item_list = [];
  });
  
  canvas.on('selection:cleared', function() {
    clearSelection();
  });
  
  function clearSelection() {
    $('#boxEditImage, #boxEditText').hide();
    $('#boxEdit').show();
  }
  
  $('#getdata-button').on('click', function() {
    alert( JSON.stringify(item_list) );
    for (i = 0; i < item_list.length; i++) { 
      var one_item = item_list[i];
      console.log(one_item, one_item.getLeft(), one_item.getTop());
    }

  });
  
});

