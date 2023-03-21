
var url_string = window.location.href;
var url = new URL(url_string);
var C1Row = parseInt(url.searchParams.get("C1Row"));
var C1Col = parseInt(url.searchParams.get("C1Col"));

var C2Row = parseInt(url.searchParams.get("C2Row"));
var C2Col = parseInt(url.searchParams.get("C2Col"));
			
var C3Row = parseInt(url.searchParams.get("C3Row"));
var C3Col = parseInt(url.searchParams.get("C3Col"));
			
var RowSpace = parseInt(url.searchParams.get("RowSpace"));
			
// For Getting A,B,C Adding Values With +65

var alphabetStart = 65;		// https://stackoverflow.com/a/23409299
var columnOneValue = alphabetStart+C1Col;
var columnTwoValue = columnOneValue+C2Col;
var columnThreeValue = columnTwoValue+C3Col;

var columnEnd;
var colOneEnd = [];
var colTwoEnd = [];
var columnEndValue;


function addSeats(alphabetStart,alphabetEnd,RowValue,RowSpace) {
	columnEnd = (RowValue-RowSpace);
	
	colOneEnd.push(columnEnd);
	colTwoEnd.push(RowValue);
	
	for (var i = alphabetStart; i < alphabetEnd; i++) {
      document.write('<div class="seats">');
      for (var j = RowValue; j >= 1; j--) {

         //Concatinating ID with Values of I & j ; ie: D1,E1...
         document.write(' <div id="'+ String.fromCharCode(i) + j + '" class="select-seats">' + j + '</div> ');

         //Adding Space After 8 and 15 items/seats
         if (j === columnEnd) {
            document.write('<div class="seat-space"></div> <div class="seat-space"></div>');
         }
      }
      document.write('<div class="seatName">'+String.fromCharCode(i) + '</div>');
      document.write("</div>");
   }
}

$(document).ready(function(){
	
	var setSelectedSeats = [];
	var curentlySelected = [];

	var getSelectedSeats = JSON.parse(localStorage.getItem("boockedTickets"));
	
	var url_string = window.location.href;
	var url = new URL(url_string);
	var RowSpace = parseInt(url.searchParams.get("RowSpace"));
	
	var ticketType;
	function getTicketType() {
		ticketType = $("select#ticketType").val();
    }
	
    $("select#ticketType").change(getTicketType);
	
	/*Fetching data from localStorage and changing class if the id is already present in the
		localStorage ie: boockedTickets
	*/
	
	$("#submit").hide();
	$("#changeView").click(function(){
		localStorage.clear();
		window.location.href = 'index.html';
	});
	
	for(let i in getSelectedSeats){
		setSelectedSeats.push(getSelectedSeats[i]);
		$("#"+getSelectedSeats[i]).removeClass("select-seats");
		$("#"+getSelectedSeats[i]).addClass("seat-unavailable");
		//console.log(getSelectedSeats[i]);
	}
	
	
	$(".select-seats").click(function(){
		var ticketQuantity = parseInt($("#ticketQuantity").val());
		
		if(ticketQuantity>0){
			if(curentlySelected.length>=ticketQuantity){
				//alert("You can only select "+ticketQuantity+ " Tickets");
				
				/*Here while clicking second time on the seats the selected seats will be removed and 
					the new selected items wil be stored in the  "setSelectedSeats" Array
				*/

				setSelectedSeats.pop();
				for(let id in curentlySelected){
					//console.log(curentlySelected[id]);
					setSelectedSeats.pop();
					$("#"+curentlySelected[id]).removeClass("select");
				}
				
				curentlySelected = [];
			}
			//setSelectedSeats.push($(this).attr('id'));
			var getId = $(this).attr('id');
			var idName = getId.charAt(0);
			//console.log(idName);
			var idNumber = parseInt(getId.substring(1));
			var i = idNumber;
			checkTicketType(idName,i);
		}
		else{
			alert("Please Select The Ticket Quantity");
		}
		
		
		function checkTicketType(getIdName,getIdNumber){
			
			switch(ticketType){
				case "premium":
					if(getIdNumber<=(colOneEnd[0]-1)){
						columnEndValue = colOneEnd[0]-1;
					}
					else{
						columnEndValue = colTwoEnd[0]
					}
					for(var i = alphabetStart;i<columnOneValue;i++){
						var seatName = String.fromCharCode(i);
						if(seatName==getIdName){
							setItem();
						}
					}
					break;
					
				case "classic":
					if(getIdNumber<=(colOneEnd[1]-1)){
						columnEndValue = colOneEnd[1]-1;
					}
					else{
						columnEndValue = colTwoEnd[1]
					}
					for(var i = columnOneValue;i<columnTwoValue;i++){
						var seatName = String.fromCharCode(i);
						if(seatName==getIdName){
							setItem();
						}
					}
					break;
					
				case "standard":
					if(getIdNumber<=(colOneEnd[2]-1)){
						columnEndValue = colOneEnd[2]-1;
					}
					else{
						columnEndValue = colTwoEnd[2]
					}
					
					for(var i = columnTwoValue;i<columnThreeValue;i++){
						var seatName = String.fromCharCode(i);
						if(seatName==getIdName){
							setItem();
						}
					}
					break;
					
				default:
					alert("Please Select Ticket Type");
			}
			
		}
		
		function setItem(value){
			while(ticketQuantity>curentlySelected.length){
					var className = $("#"+idName+i).attr('class');
					//console.log("class name : "+className);
					if((i>columnEndValue)||(className=="seat-unavailable")){
						break;
					}
					else{
					curentlySelected.push(idName+i)
					setSelectedSeats.push(idName+i);
					$("#"+idName+i).toggleClass("select");
					i++;
				}
			}
		}


		if(curentlySelected.length==ticketQuantity){
			$("#submit").show();
		}
		else{
			$("#submit").hide();
		}
		
		$("#submit").click(function(){
			// Adding Array data to the LocalStorage and reloading the page
			localStorage.setItem("boockedTickets", JSON.stringify(setSelectedSeats));
			location.reload();
		});
		
	});	
});