const prodEl = document.getElementById('production-date-inpt') //production input element
const curDateEl = document.getElementById('today-date-inpt')  //current date input element can be changed with SHIFT key
const expiryEl = document.getElementById('expiry-date-inpt')  //expiry date input element 
const SLResultEl = document.getElementById('shelf-time-result') //input element to display total shelf life
const ETResultEl = document.getElementById('expiration-date-result') //input element to display expiration
const ETPResultEl = document.getElementById('time-passed-result') //input element to display time passed
const dateEl = document.getElementById('date-inpt') //editable input element to display current date
const precentageMeterEl = document.querySelector('.meter') //the visual div element to display precentage of time passed out of the total time
const expirationMeterEl = document.querySelector('.expiration-meter') //the base visual div element under .meter element
const clearBtnEl = document.querySelector('.clear') //clear fields button
const signInptEl = document.getElementById('sign-inpt') //used as abutton to load the canvas and sign functions
const modeBtnEl = document.querySelector('.light') // used to toggle dark mode
const html = document.querySelector('html') //reffrance to the HTML element
const printBtnEl = document.querySelector('.print') //print button element
const canvas = document.createElement('canvas') //canvas element for the signing function
const btnContainerEl = document.querySelector('.buttons-container') //buttons container element
const imgEl = document.createElement('img') //image used to capture the signature drawen by the user on the canvas

let x = undefined // used to store the x position of the mouse cursor at the signTheElement() function
let y = undefined // used to store the y position of the mouse cursor at the signTheElement() function
const pos = document.querySelector('.ordexp-container').getBoundingClientRect() //used to hold the size and position of the input fields container

canvas.id = 'canvas' //setting canvas id for positioning on the html absolutly 
canvas.style.left = "" + pos.left.toString() + 'px' 
canvas.style.top = "" + pos.top.toString() + 'px'
// canvas.style.width = "" + pos.width.toString() + 'px'
// canvas.style.height = "" + html.style.height.toString() + 'px'
const ctx = canvas.getContext('2d') // the pencil used to draw on the canvas
ctx.canvas.width = pos.width
ctx.canvas.height = ctx.canvas.width * 0.5

//ctx.scale(0.19,0.19)

const MILISECS_DAY = 86400000 // used at the dateDiffInDays() function

init() 

function buildSignElement() {
  ////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                        //
  //    this function is being called from the event listener of the sign input element.    //
  //    first acontainer for the canvas and the buttons are being created                   //
  //                                                                                        //
  ////////////////////////////////////////////////////////////////////////////////////////////

  if (html.hasChildNodes('canvas')) {
    const pos = document.querySelector('.ordexp-container').getBoundingClientRect() //used to hold the size and position of the input fields container

    const signElContainer = document.createElement('div') //main signing element container 
    const btnApproveEl = document.createElement('button') //approve signature
    const btnDenyEl = document.createElement('button')    // cancel inserting the signature to the span instea of the input element and save it
    const btnExitEl = document.createElement('button')    // remove the sign element container

    html.appendChild(signElContainer)
    signElContainer.appendChild(canvas)      //
    signElContainer.appendChild(btnExitEl)   //  appending all the elements and the canvas
    signElContainer.appendChild(btnApproveEl)//
    signElContainer.appendChild(btnDenyEl)   /////
    

    signElContainer.style.left = "" + pos.left.toString() + 'px'   /////
    signElContainer.style.top = "" + pos.top.toString() + 'px'     //
    ctx.canvas.width = pos.width                                   // setting up the proportions and the positioning of the sign element
    ctx.canvas.height = (ctx.canvas.width * 0.5)                   //
    signElContainer.classList.add('signature')                     /////
    
  
    ///////////////////////////////////////////////////////
    //                                                   //
    //    setting up button text and adding css style    //
    //                                                   //
    ///////////////////////////////////////////////////////
    btnApproveEl.classList.add('approve-deny-button') 
    btnApproveEl.innerText='Approve'
    btnDenyEl.classList.add('approve-deny-button')
    btnDenyEl.innerText = 'Reset Signature'
    btnExitEl.classList.add('exit-button')
    btnExitEl.innerText = 'X'

    //dark mode handling
    if (html.classList.contains('dark')) {
      btnApproveEl.style.color = 'white'
      btnDenyEl.style.color = 'white'
      btnExitEl.style.color = 'white'
    }

    btnExitEl.addEventListener('click', () => { // event function for removing the sign element container
      html.removeChild(signElContainer)
    })
    btnDenyEl.addEventListener('click', () => { // event function for cancling and deleting the users signature
      ctx.reset()
    })
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //                                                                                                          //
      //    this event function captures the signature, move it to a global image element , puting it on the      //
      //    sign span element and then appending it after removing the input element used as a functione event    //
      //                                                                                                          //
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    btnApproveEl.addEventListener('click', () => { 
      ctx.save()
      html.removeChild(signElContainer)
      
      let img = canvas.toDataURL('image/jpg', 1.0)
      
      imgEl.setAttribute('src', img)
      imgEl.style.width = '300px'
      const signSpanEl = document.getElementById('sign-span')
    
      signSpanEl.removeChild(signInptEl)
      
      signSpanEl.appendChild(imgEl)
      
    })
    signTheElement() 
  }
}

function signTheElement() {
//////////////////////////////////////////////////////////////////////////////
//                                                                          //
//    this function handles the mouse events after the canvas is active     //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////

  let isPressed = false          //boolean used to determine if the mouse is pressed
  canvas.addEventListener('mouseleave',(e) => { //stops the drawing process if the pointer is no longer above the canvas
    isPressed = false
    x = undefined
    y = undefined
  })

  canvas.addEventListener('mousedown', (e) => { //when mouse button is pressed ,x and y relative positioning to the canvas is being
                                                //passed to the draw circle function
    isPressed = true
    x = e.offsetX
    y = e.offsetY
    drawCircle(x, y)
  })
  canvas.addEventListener('mouseup', (e) => { //when mouse button is released ,x and y are being zeroed
    isPressed = false
    x = undefined
    y = undefined
  })
  canvas.addEventListener('mousemove', (e) => {//when mouse button is pressed ,x and y relative positioning to the canvas is being
                                               //passed to the drawCircle function and the drawLine function
    if (isPressed) {
      const x2 = e.offsetX
      const y2 = e.offsetY
      drawCircle(x2,y2)
      drawLine(x, y, x2, y2) //if the mouse moved fast ,drawLine function draws a line between the circles
      x = x2
      y = y2
    }
    
  })
}
function drawCircle(x,y) {// draws the head of the pencil as a circle
  ctx.beginPath()
  ctx.arc(x, y, 8 , 0, Math.PI * 2)
  ctx.fillStyle = 'black'
  ctx.fill()

}
function drawLine(x1, y1, x2, y2) {// draws a line between to dots when mouse move is pressed when on the canvas
  
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 18
  ctx.stroke()
}
signInptEl.addEventListener('click', () => { //this click event occurs when user presses the signature input element 
                                             //and initiating the buildSignElement() function
  buildSignElement()
})
 
printBtnEl.addEventListener('click', () => {

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                                                                    //
  //    before the print function is initiated , the placeholders insidethe inputs are being cleared    //
  //                                                                                                    //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  const inputs = document.querySelectorAll('input')
  inputs.forEach((input) =>{ input.placeholder = ""}) 
  printPage()
} )

function printPage()
{  
  ///////////////////////////////////////////////////////////////////////
  //                                                                   //
  //    this function build a copy of the page which is print ready    //
  //                                                                   //
  ///////////////////////////////////////////////////////////////////////
    const sectionToPrint = document.getElementById('print-area')
    const printWindow = window.open('','print')
  
    printWindow.document.write('<html><head><title>Print Section</title>')
    printWindow.document.write('<link rel="stylesheet" href="styles.css" type="text/css" media="print"/>')
    printWindow.document.write('</head><body>')
    printWindow.document.write(sectionToPrint.innerHTML)
    printWindow.document.write('</body>')
    printWindow.document.getElementById('order-inpt').value = document.getElementById('order-inpt').value
    printWindow.document.getElementById('item-inpt').value = document.getElementById('item-inpt').value
    printWindow.document.getElementById('supplier-inpt').value = document.getElementById('supplier-inpt').value
    printWindow.document.getElementById('name-inpt').value = document.getElementById('name-inpt').value
    printWindow.document.getElementById('date-inpt').value = document.getElementById('date-inpt').value
    printWindow.document.getElementById('production-date-inpt').value = document.getElementById('production-date-inpt').value
    printWindow.document.getElementById('today-date-inpt').value = document.getElementById('today-date-inpt').value
    printWindow.document.getElementById('expiry-date-inpt').value = document.getElementById('expiry-date-inpt').value
    printWindow.document.getElementById('shelf-time-result').value = document.getElementById('shelf-time-result').value
    printWindow.document.getElementById('expiration-date-result').value = document.getElementById('expiration-date-result').value
  printWindow.document.getElementById('time-passed-result').value = document.getElementById('time-passed-result').value
  printWindow.document.getElementById('h1').innerText = 'Report Number: ' + generate()
  document.getElementById('h1').innerText = printWindow.document.getElementById('h1').innerText
    window.print()
  
}

modeBtnEl.addEventListener('click', () => { // toggle Dark and Light modes

  const meterFrame = document.querySelector('.expiration-meter') ////
  const meter = document.querySelector('.meter')                 //
  const spanP = document.querySelectorAll('.precent')            // setting up all the elements for dark mode altering
  const buttons = document.querySelectorAll('button')            //
  const inputs = document.querySelectorAll('input')              ////
  
  if (html.classList.contains('dark')) {                         ////
    html.classList.remove('dark')                                //
    buttons.forEach((button) => button.classList.remove('dark')) //
    inputs.forEach((input) => input.classList.remove('dark'))    // 
    meter.classList.add('active')                                //
    meterFrame.classList.add('dark')                             //
  } else {                                                       //// toggle 
    html.classList.add('dark')                                   //
    buttons.forEach((button) => button.classList.add('dark'))    //
    inputs.forEach((input) => input.classList.add('dark'))       //
    meter.classList.remove('active')                             //
    meterFrame.classList.add('dark')                             ////
  }
});
clearBtnEl.addEventListener('click', () => { //clear the form and signature
  init()
  prodEl.value = ""
  expiryEl.value = ""
  SLResultEl.value = ""
  ETResultEl.value = ""
  ETPResultEl.value = ""
  document.querySelector('#order-inpt').value = ""
  document.querySelector('#item-inpt').value = ""
  document.querySelector('#supplier-inpt').value = ""
  document.querySelector('#name-inpt').value = ""
  //signInptEl.value = ""
  curDateEl.setAttribute('disabled', 'disabled')
  const signSpanEl = document.getElementById('sign-span')
  if (!signSpanEl.contains(signInptEl)) {
    signSpanEl.removeChild(imgEl)
    signSpanEl.appendChild(signInptEl)
  }
})

curDateEl.addEventListener('pointerdown', (e) => { //this event function resets the current date element to be active
                                                  // if the SHIFT key is pressed
  if (e.shiftKey === true)  {
    if (curDateEl.hasAttribute('disabled')) {
      curDateEl.removeAttribute('disabled')
    } else {
      curDateEl.setAttribute('disabled', 'disabled')
    }
  }
})
prodEl.addEventListener('change',calculate) 
expiryEl.addEventListener('change', calculate)

function calculate() {
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
//    this function triggered by the change events from the product date and exipry date input elements         //
//    calculates the days differance between two dates and being proccessed by 2 functions to claculate days    //
//    and time differences                                                                                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  const curDate = curDateEl.value       //current date
  let currentDate = new Date(curDate)
  const prodDate = prodEl.value         //production date
  let productionDate = new Date(prodDate)
  const expDate = expiryEl.value        //expiration date
  let expirationDate = new Date(expDate)
  let timeDiffObject = interval(productionDate, expirationDate) //calculating the shelflife using interval function that returns date object 
  let years = timeDiffObject.years    
  let months = timeDiffObject.months
  let days = timeDiffObject.days
  let totalShelflifeDays = dateDiffInDays(productionDate, expirationDate)//calculating the shelflife using DateDiffInDays function that returns amount of days 
  let currentShelflifeDays = dateDiffInDays(productionDate, currentDate)//calculating the passed shelflife using DateDiffInDays function that returns amount of days
  let precentage = currentShelflifeDays / totalShelflifeDays //precentage is used to visually calculate and display the % of shelf life 
                                                              //days tha have passed
  if (currentDate > productionDate && expirationDate > currentDate) { // this if statement prevents from using a unchronological input from the user
    
  SLResultEl.value = setText(years, months, days) // sets the amout of time left in a text quantity format
  timeDiffObject = interval(currentDate, expirationDate) //expiration time left
  years = timeDiffObject.years
  months = timeDiffObject.months
  days = timeDiffObject.days

  ETResultEl.value = setText(years, months, days) // sets the amout of time left in a text quantity format
  timeDiffObject = interval(productionDate, currentDate)// time passed
  years = timeDiffObject.years
  months = timeDiffObject.months
  days = timeDiffObject.days

  ETPResultEl.value = setText(years, months, days)// sets the amout of time left in a text quantity format
  precentage = Math.floor(precentage * 10000) / 100 //formating the precent value to have to places after the dot

  precentageMeterEl.innerHTML = `${precentage}%` //dynamiclly sets the precent text number inside the meter element
  precentageMeterEl.style.width = ((precentage / 100) * expirationMeterEl.clientWidth) + 'px'   // calculates the .meter element width 
                                                                                                //based on the precent value
  }
}

function init() {//initialize the current date input elements
  curDateEl.valueAsDate = new Date()
  dateEl.valueAsDate = new Date()
}

function interval(date1, date2) {   
////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
//    this function calculates dates intervals by braking the date object to days months and years    //
//      and subsequentlly subtructs the lower                                                         //
//    value from the high and eventually builds back the date object and returning it                 //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////

  if (date1 > date2) { // swap
        var result = interval(date2, date1)
        result.years  = -result.years
        result.months = -result.months
        result.days   = -result.days
        result.hours  = -result.hours
        return result
  }
    result = {
        years:  date2.getYear()  - date1.getYear(),
        months: date2.getMonth() - date1.getMonth(),
        days:   date2.getDate()  - date1.getDate(),
        hours:  date2.getHours() - date1.getHours()
    }
    if (result.hours < 0) {
        result.days--
        result.hours += 24
    }
    if (result.days < 0) {
        result.months--
        // days = days left in date1's month, 
        //   plus days that have passed in date2's month
        var copy1 = new Date(date1.getTime())
        copy1.setDate(32)
        result.days = 32-date1.getDate()-copy1.getDate()+date2.getDate()
    }
    if (result.months < 0) {
        result.years--
        result.months+=12
  }
  
  if (result.days === 31) {
    result.days = 0
    result.months += 1
    if (result.months === 12) {
      result.months = 0
      result.years += 1
    }
  }
    return result
}

function setText(year, month, day) {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                //
//    this function receive numbers and converts it to text based mostly on the plural or single value of the numbers received    //
//    after calculating the differances and returns the time formatted as a strings collection                                    //
//                                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  let resultText = ''
  if (year > 1)
    resultText += year + ' years'
  else if (year === 1) {
    resultText += "One year"
  } 

  if (resultText !== '' && month !== 0) {
    resultText += " , "
  }

  if (month > 1) {
    resultText += month +' months'
  } else if (month === 1) {
    resultText += ' One month'
  } 
  
  if (resultText !== '' && day !== 0) {
    resultText += " and "
  }


  if (day > 1) {
    resultText += day + ' days'
  } else if(day === 1){
    resultText += ' One day' 
  }

  return resultText
}

function dateDiffInDays(firstDate, secondDate) {
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
//    this function calculate tome differances by converting MILISECS_DAY amount of milisecs to days     //
//    and returning only the amount of days as the result                                                //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const utc1 = Date.UTC(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
  const utc2 = Date.UTC(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate());

  return Math.floor((utc2 - utc1) / MILISECS_DAY);
}

function generate() {
  
  ////////////////////////////////////////////////////////////////////////////
  //                                                                        //
  //    this function generate a report number based on the current date    //
  //    and it is being called when the document is printed                 //
  //                                                                        //
  ////////////////////////////////////////////////////////////////////////////
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const time = date.getUTCMinutes()
  const milisecs = date.getMilliseconds()

  const result = Math.sqrt(year / time + month * day) * milisecs * 100
  let trimedResult = Math.floor(result )
  const reportNumber = trimedResult.toString().padStart(9, '0')
  return reportNumber
}
  

