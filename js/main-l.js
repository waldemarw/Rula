/**
 * Copyright (c) 2019
 *
 * RULA Employee Assessment (long description)
 *
 * @summary RULA Employee Assessment (short description)
 * @author Waldemar Walczak <wswalczak@outlook.com>
 *
 * Created at     : 2019-12-13 02:21:56 
 * Last modified  : 2019-12-18 15:31:40
 */

 let nextBtn = document.getElementById("next-btn");
 let prevBtn = document.getElementById("prev-btn");
 let resultsBtn = document.getElementById("results-btn");
 let controls = document.getElementById("controls");
 let questionContainer = document.getElementsByClassName("radio");
 let scoreContainer = document.getElementById("score-container");

 let currentQuestionIndex = 1;

 let upperArmValue = 0;
 let upperArmAdjValue = 0;

 let lowerArmValue = 0;
 let lowerArmAdjValue = 0;

 let wristValue = 0; 
 let wristAdjValue = 0;

 let wristTwistValue = 0;

 let forceLoadValue = 0;
 let muscleUseValue = 0;

 let neckValue = 0;
 let neckAdjValue = 0;

 let trunkValue = 0;
 let trunkAdjValue = 0;

 let legsValue = 0;

 let forceLoadB = 0;
 let muscleUseB = 0;

 let AScore = 0;
 let BScore = 0;

//Part A total
let wristArmScore = 0;
//Part B total
let neckTrunkLegsScore = 0;

let finalScore = 0;

let tables = [
{ 
    //Table A
    //'0123' - 0 is upper arm, 1 is lower arm, 2 is wrist and 3 is wrist twist
    '0111': 1, '0112': 2, '0121': 2, '0122': 2, '0131': 2, '0132': 3, '0141': 3, '0142': 3,
    '0211': 2, '0212': 2, '0221': 2, '0222': 2, '0231': 3, '0232': 3, '0241': 3, '0242': 3,
    '0311': 2, '0312': 3, '0321': 3, '0322': 3, '0331': 3, '0332': 3, '0341': 4, '0342': 4,

    '1111': 1, '1112': 2, '1121': 2, '1122': 2, '1131': 2, '1132': 3, '1141': 3, '1142': 3, 
    '1211': 2, '1212': 2, '1221': 2, '1222': 2, '1231': 3, '1232': 3, '1241': 3, '1242': 3,
    '1311': 2, '1312': 3, '1321': 3, '1322': 3, '1331': 3, '1332': 3, '1341': 4, '1342': 4,

    '2111': 2, '2112': 3, '2121': 3, '2122': 3, '2131': 3, '2132': 4, '2141': 4, '2142': 4,
    '2211': 3, '2212': 3, '2221': 3, '2222': 3, '2231': 3, '2232': 4, '2241': 4, '2242': 4,
    '2311': 3, '2312': 4, '2321': 4, '2322': 4, '2331': 4, '2332': 4, '2341': 5, '2342': 5,

    '3111': 3, '3112': 3, '3121': 4, '3122': 4, '3131': 4, '3132': 4, '3141': 5, '3142': 5,
    '3211': 3, '3212': 4, '3221': 4, '3222': 4, '3231': 4, '3232': 4, '3241': 5, '3242': 5,
    '3311': 4, '3312': 4, '3321': 4, '3322': 4, '3331': 4, '3332': 5, '3341': 5, '3342': 5,

    '4111': 4, '4112': 4, '4121': 4, '4122': 4, '4131': 4, '4132': 5, '4141': 5, '4142': 5,
    '4211': 4, '4212': 4, '4221': 4, '4222': 4, '4231': 4, '4232': 5, '4241': 5, '4242': 5,
    '4311': 4, '4312': 4, '4321': 4, '4322': 5, '4331': 5, '4332': 5, '4341': 6, '4342': 6,

    '5111': 5, '5112': 5, '5121': 5, '5122': 5, '5131': 5, '5132': 6, '5141': 6, '5142': 7,
    '5211': 5, '5212': 6, '5221': 6, '5222': 6, '5231': 6, '5232': 7, '5241': 7, '5242': 7,
    '5311': 5, '5312': 6, '5321': 6, '5322': 6, '5331': 6, '5332': 7, '5341': 7, '5342': 7,

    '6111': 7, '6112': 7, '6121': 7, '6122': 7, '6131': 7, '6132': 8, '6141': 8, '6142': 9,
    '6211': 8, '6212': 8, '6221': 8, '6222': 8, '6231': 8, '6232': 9, '6241': 9, '6242': 9,
    '6311': 9, '6312': 9, '6321': 9, '6322': 9, '6331': 9, '6332': 9, '6341': 9, '6342': 9
},
{ 
    //Table B
    //'012' - 0 is neck, 1 is trunk, 2 are legs
    '111': 1, '112': 3, '121': 2, '122': 3, '131': 3, '132': 4, '141': 5, '142': 5, '151': 6, '152': 6, '161': 6, '162': 7,
    '211': 2, '212': 3, '221': 2, '222': 3, '231': 4, '232': 5, '241': 5, '242': 5, '251': 6, '252': 7, '261': 7, '262': 7,
    '311': 3, '312': 3, '321': 3, '322': 4, '331': 4, '332': 5, '341': 5, '342': 6, '351': 6, '352': 7, '361': 7, '362': 7,
    '411': 5, '412': 5, '421': 5, '422': 6, '431': 6, '432': 7, '441': 7, '442': 7, '451': 7, '452': 7, '461': 8, '462': 8,
    '511': 7, '512': 7, '521': 7, '522': 7, '531': 7, '532': 8, '541': 8, '542': 8, '551': 8, '552': 8, '561': 8, '562': 8,
    '611': 8, '612': 8, '621': 8, '622': 8, '631': 8, '632': 8, '641': 8, '642': 9, '651': 9, '652': 9, '661': 9, '662': 9, 
    '672': 9, '772': 9
},
{ 
    //Table C
    //'01' - 0 is Wrist&Arm score, 1 is NeckTrunk&Leg score
    '1x1': 1, '1x2': 2, '1x3': 3, '1x4': 3, '1x5': 4, '1x6': 5, '1x7': 5,    '1x8': 5, '1x9': 5, '1x10': 5, '1x11': 5, '1x12': 5, '1x13': 5,
    '2x1': 2, '2x2': 2, '2x3': 3, '2x4': 4, '2x5': 4, '2x6': 5, '2x7': 5,    '2x8': 5, '2x9': 5, '2x10': 5, '2x11': 5, '2x12': 5, '2x13': 5,
    '3x1': 3, '3x2': 3, '3x3': 3, '3x4': 4, '3x5': 4, '3x6': 5, '3x7': 6,    '3x8': 6, '3x9': 6, '3x10': 6, '3x11': 6, '3x12': 6, '3x13': 6,
    '4x1': 3, '4x2': 3, '4x3': 3, '4x4': 4, '4x5': 5, '4x6': 6, '4x7': 6,    '4x8': 6, '4x9': 6, '4x10': 6, '4x11': 6, '4x12': 6, '4x13': 6,
    '5x1': 4, '5x2': 4, '5x3': 4, '5x4': 5, '5x5': 6, '5x6': 7, '5x7': 7,    '5x8': 7, '5x9': 7, '5x10': 7, '5x11': 7, '5x12': 7, '5x13': 7,
    '6x1': 4, '6x2': 4, '6x3': 5, '6x4': 6, '6x5': 6, '6x6': 7, '6x7': 7,    '6x8': 7, '6x9': 7, '6x10': 7, '6x11': 7, '6x12': 7, '6x13': 7,
    '7x1': 5, '7x2': 5, '7x3': 6, '7x4': 6, '7x5': 7, '7x6': 7, '7x7': 7,    '7x8': 7, '7x9': 7, '7x10': 7, '7x11': 7, '7x12': 7, '7x13': 7,
    '8x1': 5, '8x2': 5, '8x3': 6, '8x4': 7, '8x5': 7, '8x6': 7, '8x7': 7,    '8x8': 7, '8x9': 7, '8x10': 7, '8x11': 7, '8x12': 7, '8x13': 7,
    '9x1': 5, '9x2': 5, '9x3': 6, '9x4': 7, '9x5': 7, '9x6': 7, '9x7': 7,    '9x8': 7, '9x9': 7, '9x10': 7, '9x11': 7, '9x12': 7, '9x13': 7,

    '10x1': 5, '10x2': 5, '10x3': 6, '10x4': 7, '10x5': 7, '10x6': 7, '10x7': 7,     '10x8': 7, '10x9': 7, '10x10': 7, '10x11': 7, '10x12': 7, '10x13': 7,
    '11x1': 5, '11x2': 5, '11x3': 6, '11x4': 7, '11x5': 7, '11x6': 7, '11x7': 7,     '11x8': 7, '11x9': 7, '11x10': 7, '11x11': 7, '11x12': 7, '11x13': 7,
    '12x1': 5, '12x2': 5, '12x3': 6, '12x4': 7, '12x5': 7, '12x6': 7, '12x7': 7,     '12x8': 7, '12x9': 7, '12x10': 7, '12x11': 7, '12x12': 7, '12x13': 7,
    '13x1': 5, '13x2': 5, '13x3': 6, '13x4': 7, '13x5': 7, '13x6': 7, '13x7': 7,     '13x8': 7, '13x9': 7, '13x10': 7, '13x11': 7, '13x12': 7, '13x13': 7,
} ];

/*///////////////////////////////////////////////////////////////////////
*                            Flow control                               *
*////////////////////////////////////////////////////////////////////////

// unlocks clickable tabs
// $('#question-list a').on('click', function (e) {
// 	e.preventDefault();
// 	$(this).tab('show');
// 	currentQuestionIndex = parseInt($(this).text());
// 	console.log(currentQuestionIndex);
// })


//enable popover and tooltip
$(document).ready(function(){
	$('[data-toggle="popover"]').popover();
});

$('.popover-dismiss').popover({
	trigger: 'focus'
})

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})

//set today's date in form (step 10)
let today = new Date();
let dd = ("0" + (today.getDate())).slice(-2);
let mm = ("0" + (today.getMonth() +　1)).slice(-2);
let yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd ;
$("#form-date").attr("value", today);

for (var i = 0; i < $('.question-container').length; i++) {
	$('.question-container')[i].classList.add("animated", "fadeIn");
	controls.classList.add('animated','fadeIn');
}

for (var i = 0; i < $('.radio').length; i++) {
	$('.radio')[i].addEventListener('click', selectAnswer);
}

$('.next-btn').on('click', (e) => {
	e.preventDefault();

	if (currentQuestionIndex < 10) {
		currentQuestionIndex++;
	}

	console.log("Current question index: " + currentQuestionIndex);

	topFunction();
	setOutput();
	selectAnswer();
	setTableScores();
	rulaScore();

	$('a[href="#step-' + currentQuestionIndex + '"]').tab('show');

})

$("#prev-btn").on('click', (e) => {
	e.preventDefault();

	if (currentQuestionIndex > 1) {
		currentQuestionIndex--;
	}

	topFunction();
	selectAnswer();

	if (currentQuestionIndex === 1) {
		prevBtn.classList.add("hide");
	}

	// setOutput();
	// rulaScore();

	$('a[href="#step-' + currentQuestionIndex + '"]').tab('show');

	console.log(currentQuestionIndex);

})

function selectAnswer() {
	nextBtn.classList.add("hide");

	if (currentQuestionIndex === 1) {
		prevBtn.classList.add("hide");
	} else {
		prevBtn.classList.remove("hide");
	}

	if (document.querySelector('input[name="radio-q' + currentQuestionIndex + '"]:checked')) {

		document.getElementById('nav' + currentQuestionIndex).style.color = "#2aa747";
		document.getElementById('nav' + currentQuestionIndex).style.cursor = "pointer";
		document.getElementById('nav' + currentQuestionIndex).classList.add("animated", "flipInY", "font-weight-bold");

		document.getElementById("optional-fields-q" + currentQuestionIndex).classList.remove('hide');
		document.getElementById("optional-fields-q" + currentQuestionIndex).scrollIntoView();
		document.getElementById("optional-fields-q" + currentQuestionIndex).classList.add('animated','fadeIn');

		$('#nav'+currentQuestionIndex).on('click', function (e) {
			e.preventDefault();
			$(this).tab('show');

			currentQuestionIndex = parseInt($(this).text());
			console.log(currentQuestionIndex);
			if (currentQuestionIndex < 10) {

				nextBtn.classList.remove("hide");

			} else if (currentQuestionIndex === 10) {

				nextBtn.classList.add("hide");
			}

			if (currentQuestionIndex === 1) {

				prevBtn.classList.add("hide");

			} else {
				prevBtn.classList.remove("hide");
			}

		})

		if (currentQuestionIndex < 10) {

			nextBtn.classList.remove("hide");

		} else if (currentQuestionIndex === 10) {

			nextBtn.classList.add("hide");
		}
	} 


}

//go to the top of the page
function topFunction() {

  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


function toggleResultsMobile() {

	if ($('#results-card').hasClass('slideInUp')) {

		$(".results-card").toggleClass("slideInUp slideOutDown");

		$('#show-results').html(
			`<div class="animated flipInX">
			<img src="media/arrow-up.png"><br>
			<h6><strong>Show scores</strong></h6>
			</div>`
			);

	} else if ($('#results-card').hasClass("slideOutDown")) {

		$(".results-card").toggleClass("slideOutDown slideInUp");

		$('#show-results').html(
			`<div class="animated flipInX">
			<img src="media/arrow-down.png"><br>
			<h6><strong>Hide scores</strong></h6>
			</div>`
			);

	} else {
		$(".results-card").toggleClass("slideInUp");
		$(".results-card").toggleClass("results-card-hide results-card-show");

		$('#show-results').html(`
			<div class="animated flipInX">
			<img src="media/arrow-down.png"><br>
			<h6><strong>Hide scores</strong></h6>
			</div>`
			);
	}
}


function getFormInput() {

	inputEmail = document.getElementById('form-email').value;
	inputSubject = document.getElementById('form-subject').value;
	inputScorer = document.getElementById('form-scorer').value;
	inputDepartment = document.getElementById('form-department').value;
	inputCompany = document.getElementById('form-company').value;
	inputDate = document.getElementById('form-date').value;

}

/*///////////////////////////////////////////////////////////////////////
//////////////////// Everything below handles scores ////////////////////
*////////////////////////////////////////////////////////////////////////
function getInput() {

	switch (currentQuestionIndex) {

		case 2:

		upperArmValue = parseInt(document.querySelector('input[name="radio-q1"]:checked').value);
		upperArmAdjValue = 0;
		//checkboxes

		if (document.querySelector('input[name="customCheck-q1"]:checked')) {
			options = document.getElementsByName("customCheck-q1");

			for (var i = 0; i < options.length; i++) {
				if (options[i].type === 'checkbox' && options[i].checked === true) {
					upperArmAdjValue += parseInt(options[i].value);
					//summary
					document.getElementById("sum-"+options[i].id).classList.remove("sum-li");
				}


			}
		} else {
			upperArmAdjValue = 0; 
		}

		for (var i = 0; i < document.getElementsByName("customCheck-q1").length; i++) {
			if (document.getElementsByName("customCheck-q1")[i].checked === false) {
					//summary
					document.getElementById("sum-"+document.getElementsByName("customCheck-q1")[i].id).classList.add("sum-li");
					console.log(document.getElementById("sum-"+document.getElementsByName("customCheck-q1")[i].id));

				}
			}

			break;

			case 3:
			lowerArmValue = parseInt(document.querySelector('input[name="radio-q2"]:checked').value);

			if (document.querySelector('input[name="customCheck-q2"]:checked')) {
				lowerArmAdjValue = parseInt(document.querySelector('input[name="customCheck-q2"]:checked').value);
			//summary
			document.getElementById("sum-customCheck-q2").classList.toggle("sum-li");

		} else {
			lowerArmAdjValue = 0; 
			document.getElementById("sum-customCheck-q2").classList.add("sum-li");
		}

		break;

		case 4:

		document.getElementById("show-results").classList.remove("bounce");

		wristValue = parseInt(document.querySelector('input[name="radio-q3"]:checked').value);

		if (document.querySelector('input[name="customCheck-q3"]:checked')) {
			wristAdjValue = parseInt(document.querySelector('input[name="customCheck-q3"]:checked').value);
			//summary
			document.getElementById("sum-customCheck-q3").classList.toggle("sum-li");

		} else {
			wristAdjValue = 0; 
			document.getElementById("sum-customCheck-q3").classList.add("sum-li");
		}

		break;

		case 5:


		document.getElementById("show-results").classList.add("bounce");

		wristTwistValue = parseInt(document.querySelector('input[name="radio-q4"]:checked').value);


		break;

		case 6:

		forceLoadValue = parseInt(document.querySelector('input[name="radio-q5"]:checked').value);

		if (document.querySelector('input[name="customCheck-q5"]:checked')) {
			muscleUseValue = parseInt(document.querySelector('input[name="customCheck-q5"]:checked').value);
			//summary
			//document.getElementById("sum-customCheck-q5").classList.toggle("sum-li");
			document.getElementById("sum-customCheck-q5").classList.toggle("sum-li");

		} else {
			muscleUseValue = 0; 
			document.getElementById("sum-customCheck-q5").classList.add("sum-li");
		}

		break;

		case 7:

		neckValue = parseInt(document.querySelector('input[name="radio-q6"]:checked').value);

		//checkboxes
		if (document.querySelector('input[name="customCheck-q6"]:checked')) {
			neckAdjValue = 0;
			let options = document.getElementsByName("customCheck-q6");

			for (var i = 0; i < options.length; i++) {
				if (options[i].type === 'checkbox' && options[i].checked === true) {
					neckAdjValue += parseInt(options[i].value);
					//summary
					document.getElementById("sum-"+options[i].id).classList.remove("sum-li");
				}
			} 

		} else {
			neckAdjValue = 0; 
		}

		for (var i = 0; i < document.getElementsByName("customCheck-q6").length; i++) {
			if (document.getElementsByName("customCheck-q6")[i].checked === false) {
					//summary
					document.getElementById("sum-"+document.getElementsByName("customCheck-q6")[i].id).classList.add("sum-li");
					console.log(document.getElementById("sum-"+document.getElementsByName("customCheck-q6")[i].id));

				}
			}

			break;

			case 8:

			trunkValue = parseInt(document.querySelector('input[name="radio-q7"]:checked').value);


		//checkboxes
		if (document.querySelector('input[name="customCheck-q7"]:checked')) {
			trunkAdjValue = 0;
			let options = document.getElementsByName("customCheck-q7");

			for (var i = 0; i < options.length; i++) {
				if (options[i].type === 'checkbox' && options[i].checked === true) {
					trunkAdjValue += parseInt(options[i].value);
					//summary
					document.getElementById("sum-"+options[i].id).classList.remove("sum-li");
				}
			} 

		} else {
			trunkAdjValue = 0; 
		}

		for (var i = 0; i < document.getElementsByName("customCheck-q7").length; i++) {
			if (document.getElementsByName("customCheck-q7")[i].checked === false) {
				//summary
				document.getElementById("sum-"+document.getElementsByName("customCheck-q7")[i].id).classList.add("sum-li");
				console.log(document.getElementById("sum-"+document.getElementsByName("customCheck-q7")[i].id));

			}
		}

		break;

		case 9:

		legsValue = parseInt(document.querySelector('input[name="radio-q8"]:checked').value);

		break;

		case 10:

		document.getElementById("nav11").classList.remove("hide");

		forceLoadB = parseInt(document.querySelector('input[name="radio-q9"]:checked').value);

		if (document.querySelector('input[name="customCheck-q9"]:checked')) {
			muscleUseB = parseInt(document.querySelector('input[name="customCheck-q9"]:checked').value);
			//summary
			document.getElementById("sum-customCheck-q9").classList.remove("sum-li");
		} else {
			muscleUseB = 0; 
			document.getElementById("sum-customCheck-q9").classList.add("sum-li");
		}

		document.getElementById('nav10').style.color = "#2aa747";
		document.getElementById('nav10').style.cursor = "pointer";
		document.getElementById('nav10').classList.add("animated", "flipInY", "font-weight-bold");

		$('#nav10').on('click', function (e) {
			e.preventDefault();
			$(this).tab('show');
			currentQuestionIndex = 10;
			console.log(currentQuestionIndex);
			nextBtn.classList.add("hide");
			prevBtn.classList.remove("hide");
		})

		break;

		case 11:

		getFormInput();

		$('#nav11').on('click', function (e) {
			e.preventDefault();
			$(this).tab('show');
			nextBtn.classList.add("hide");
			showResults();
		});

		document.getElementById('nav11').style.cursor = "pointer";
		document.getElementById('nav11').style.color = "black";

		prevBtn.classList.add("hide");

		$('#email').html(`<li class="user-input">${inputEmail}</li>`);
		$('#subject').html(`<li class="user-input">${inputSubject}</li>`);
		$('#scorer').html(`<li class="user-input">${inputScorer}</li>`);
		$('#department').html(`<li class="user-input">${inputDepartment}</li>`);
		$('#company').html(`<li class="user-input">${inputCompany}</li>`);
		$('#date').html(`<li class="user-input">${inputDate}</li>`);


		const resultsContainer = document.createElement('div');
		resultsContainer.setAttribute("id", "results-container");
		document.getElementById("step-11").appendChild(resultsContainer);


		const sumTable = document.createElement('div');
		sumTable.setAttribute("id", "sum-table");
		document.getElementById("modal-body").appendChild(sumTable);


		break;

		default:
		alert("Something went wrong. Reload page to start over.");
	}
}

function setTableScores() {
    // console.log('You scored: ' + (upperArmValue + armAdjValue).toString() + 
    //     (lowerArmValue + lowerArmAdjValue).toString() + 
    //     (wristValue + wristAdjValue).toString() +
    //     wristTwistValue.toString())
    totalAValue = (upperArmValue + upperArmAdjValue).toString() + 
    (lowerArmValue + lowerArmAdjValue).toString() + 
    (wristValue + wristAdjValue).toString() +
    wristTwistValue.toString();

    AScore = parseInt(tables[0][totalAValue]);
    // console.log('AScore = ' + AScore); 

        // console.log('You scored: ' + (neckValue + neckAdjValue).toString() +
    //     (trunkValue + trunkAdjValue).toString() +
    //     legsValue.toString());
    totalBValue = (neckValue + neckAdjValue).toString() +
    (trunkValue + trunkAdjValue).toString() +
    legsValue.toString();

    BScore = parseInt(tables[1][totalBValue]);
    // console.log('BScore = ' + BScore); 
}

function setOutput() {

	getInput();
	//part a
	$("#upper-arm").html(parseInt(upperArmValue + upperArmAdjValue));
	$("#lower-arm").html(parseInt(lowerArmValue + lowerArmAdjValue));
	$("#wrist").html(parseInt(wristValue + wristAdjValue));
	$("#wrist-twist").html(parseInt(wristTwistValue));
	$("#muscle-a").html(parseInt(forceLoadValue + muscleUseValue));
	//part b
	$("#neck").html(parseInt(neckValue + neckAdjValue));
	$("#trunk").html(parseInt(trunkValue + trunkAdjValue));
	$("#leg").html(parseInt(legsValue));
	$("#muscle-b").html(parseInt(forceLoadB + muscleUseB));
	
	//these ifs avoid displaying 'NaN' instead of 0 on results table
	if (AScore !== AScore) {
		$("part-b-score").html('0');

	} else {
		wristArmScore = AScore + parseInt(forceLoadValue + muscleUseValue);

		$("#posture-a").html(parseInt(AScore));
		$("#part-a-score").html(wristArmScore);
	}

	if (BScore !== BScore) {
		$("part-b-score").html('0');

	} else {
		neckTrunkLegsScore = BScore + parseInt(forceLoadB + muscleUseB);

		$("#posture-b").html(parseInt(BScore));
		$("#part-b-score").html(neckTrunkLegsScore);

		let tableCScore = wristArmScore + "x" + neckTrunkLegsScore;

		finalScore = parseInt(tables[2][tableCScore]);

	}
	console.log(finalScore);
}


function showResults() {
	setOutput();
	setTableScores();
	topFunction();
	rulaScore();

	currentQuestionIndex = 11;

	document.getElementById("results-card").classList.add("hide");
	document.getElementById("show-results").classList.add("hide");

	$(".results-list>li.hide").removeClass("hide");




}

function rulaScore() {

	if (finalScore < 3) {
        // resultsContainer.classList.add("acceptable-posture");
        // resultsImageContainer.innerHTML = "<img src='media/manikin_logo.png' class='card-img'>"
        $('#score-container, #rula-scorecard').html(
        	`<h4 style="text-align: left;"><img src="media/icons/target.png" alt="Final RULA Score Icon" style="float: left; margin-right: 5px;">Final RULA score:</h4>
        	<div class="bg-success rula-card">
        	<ul style="list-style: none; padding: 15px;">
        	<li style="color: white;">
        	<h5>RULA Score: ${finalScore}</h5>
        	Action level 1: The posture is acceptable if it is not maintained or repeated for long periods
        	</li>
        	</ul>
        	</div>`);
        
    } else if (finalScore > 2 && finalScore < 5) {
        // resultsContainer.classList.add("f-investigation");
        // resultsImageContainer.innerHTML = "<img src='media/manikin_logo.png' class='card-img'>"
        $('#score-container, #rula-scorecard').html(
        	`<h4 style="text-align: left;"><img src="media/icons/target.png" alt="Final RULA Score Icon" style="float: left; margin-right: 5px;">Final RULA score:</h4>
        	<div class="bg-warning rula-card">
        	<ul style="list-style: none; padding: 15px;">
        	<li style="color: white;">
        	<h5>RULA Score: ${finalScore}</h5>
        	Action level 2:
        	Further investigation is needed and changes may be required
        	</li>
        	</ul>
        	</div>`);
    } 
    else if (finalScore > 4 && finalScore < 7) {
        // resultsContainer.classList.add("change-soon");
        // resultsImageContainer.innerHTML = "<img src='media/manikin_logo.png' class='card-img'>"
        $('#score-container, #rula-scorecard').html(
        	`<h4 style="text-align: left;"><img src="media/icons/target.png" alt="Final RULA Score Icon" style="float: left; margin-right: 5px;">Final RULA score:</h4>
        	<div class="bg-warning rula-card">
        	<ul style="list-style: none; padding: 15px;">
        	<li style="color: white;">
        	<h5>RULA Score: ${finalScore}</h5>
        	Action level 3:
        	Further investigation and changes are required soon
        	</li>
        	</ul>
        	</div>`);
    }
    else if (finalScore >= 7) {
        // resultsContainer.classList.add("investigate-change");
        // resultsImageContainer.innerHTML = "<img src='media/manikin_logo.png' class='card-img'>"
        $('#score-container, #rula-scorecard').html( 
        	`<h4 style="text-align: left;"><img src="media/icons/target.png" alt="Final RULA Score Icon" style="float: left; margin-right: 5px;">Final RULA score:</h4>
        	<div class="bg-danger rula-card">
        	<ul style="list-style: none; padding: 15px;">
        	<li style="color: white;">
        	<h5>RULA Score: ${finalScore}</h5>
        	Action level 4:
        	Further investigation and changes are required immediately
        	</li>
        	</ul>
        	</div>`);
    }

}

$("#html2canvas").click(function(e) {

	document.getElementById("html2canvas").disabled = true;
	setTimeout(function(){document.getElementById("html2canvas").disabled = false;},5000)

	for(let i=0; i<document.getElementById('sum-answers').length; i++) {
		document.getElementById('sum-answers')[i].classList.remove("sum-cont-mob");
	}


	let element = document.getElementById('modal-body');
	let opt = {
  margin:       [0.2, 0.3, 0.2, 0.3], //anticlockwise
  filename:     'rula-scoresheet-left.pdf',
  image:        { type: 'jpeg', quality: 1 },
  html2canvas:  {  },
  jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
};

// New Promise-based usage:
html2pdf().from(element).set(opt).save();


}); 


$("#modal-btn, #results-btn, #full-sum-btn").click(function(e) {

	e.preventDefault();

//clone personal details
  // let itm = 0;
  // let cln = 0;

  // itm = document.getElementById("details-list");
  // cln = itm.cloneNode(true);
  // document.getElementById("sum-sum").appendChild(cln);v



  if ($('#modal-body>#results-list-cont')) {

  	$('#modal-body>#results-list-cont').remove();

  }

  itm = document.getElementById("results-list-cont");
  cln = itm.cloneNode(true);
  document.getElementById("modal-body").appendChild(cln);



  switch (document.querySelector('input[name="radio-q1"]:checked').id) {
  	case "radio1-q1":
  	$("#sum-1-img").html(`<img src="media/summary/left-side/sum-1/sum-1-1.jpg" alt="" height="180px">`);
  	break;

  	case "radio2-q1":
  	$("#sum-1-img").html(`<img src="media/summary/left-side/sum-1/sum-1-2.jpg" alt="" height="180px">`);
  	break;

  	case "radio3-q1":
  	$("#sum-1-img").html(`<img src="media/summary/left-side/sum-1/sum-1-3.jpg" alt="" height="180px">`);
  	break;

  	case "radio4-q1":
  	$("#sum-1-img").html(`<img src="media/summary/left-side/sum-1/sum-1-4.jpg" alt="" height="180px">`);
  	break;

  	case "radio5-q1":
  	$("#sum-1-img").html(`<img src="media/summary/left-side/sum-1/sum-1-5.jpg" alt="" height="180px">`);
  	break;

  	default:
  	console.log("Error");
  }

  switch (document.querySelector('input[name="radio-q2"]:checked').id) {
  	case "radio1-q2":
  	$("#sum-2-img").html(`<img src="media/summary/left-side/sum-2/sum-2-1.jpg" alt="" height="90px">`);
  	break;

  	case "radio2-q2":
  	$("#sum-2-img").html(`<img src="media/summary/left-side/sum-2/sum-2-2.jpg" alt="" height="90px">`);
  	break;

  	case "radio3-q2":
  	$("#sum-2-img").html(`<img src="media/summary/left-side/sum-2/sum-2-3.jpg" alt="" height="90px">`);
  	break;

  	default:
  	console.log("Error");
  }

  switch (document.querySelector('input[name="radio-q3"]:checked').id) {
  	case "radio1-q3":
  	$("#sum-3-img").html(`<img src="media/summary/left-side/sum-3/sum-3-1.jpg" alt="" height="130px">`);
  	break;

  	case "radio2-q3":
  	$("#sum-3-img").html(`<img src="media/summary/left-side/sum-3/sum-3-2.jpg" alt="" height="130px">`);
  	break;

  	case "radio3-q3":
  	$("#sum-3-img").html(`<img src="media/summary/left-side/sum-3/sum-3-3.jpg" alt="" height="130px">`);
  	break;

  	case "radio4-q3":
  	$("#sum-3-img").html(`<img src="media/summary/left-side/sum-3/sum-3-4.jpg" alt="" height="130px">`);
  	break;

  	default:
  	console.log("Error");
  }

  switch (document.querySelector('input[name="radio-q4"]:checked').id) {
  	case "radio1-q4":
  	$("#sum-4-img").html(`<img src="media/summary/sum-4/sum-4-1.jpg" alt="" height="90px">`);
  	break;

  	case "radio2-q4":
  	$("#sum-4-img").html(`<img src="media/summary/sum-4/sum-4-2.jpg" alt="" height="90px">`);
  	break;

  	default:
  	console.log("Error");
  }


  switch (document.querySelector('input[name="radio-q5"]:checked').id) {
  	case "radio1-q5":
  	document.getElementById("sum-5-q1").classList.remove(`sum-li`);
  	document.getElementById("sum-5-q2").classList.add(`sum-li`);
  	document.getElementById("sum-5-q3").classList.add(`sum-li`);
  	document.getElementById("sum-5-q4").classList.add(`sum-li`);
  	break;

  	case "radio2-q5":
  	document.getElementById("sum-5-q2").classList.remove(`sum-li`);
  	document.getElementById("sum-5-q1").classList.add(`sum-li`);
  	document.getElementById("sum-5-q3").classList.add(`sum-li`);
  	document.getElementById("sum-5-q4").classList.add(`sum-li`);
  	break;

  	case "radio3-q5":
  	document.getElementById("sum-5-q3").classList.remove(`sum-li`);
  	document.getElementById("sum-5-q1").classList.add(`sum-li`);
  	document.getElementById("sum-5-q2").classList.add(`sum-li`);
  	document.getElementById("sum-5-q4").classList.add(`sum-li`);
  	break;

  	case "radio4-q5":
  	document.getElementById("sum-5-q4").classList.remove(`sum-li`);
  	document.getElementById("sum-5-q1").classList.add(`sum-li`);
  	document.getElementById("sum-5-q2").classList.add(`sum-li`);
  	document.getElementById("sum-5-q3").classList.add(`sum-li`);
  	break;

  	default:
  	console.log("Error");
  }

  switch (document.querySelector('input[name="radio-q6"]:checked').id) {
  	case "radio1-q6":
  	$("#sum-6-img").html(`<img src="media/summary/sum-6/sum-6-1.jpg" alt="" height="90px">`);
  	break;

  	case "radio2-q6":
  	$("#sum-6-img").html(`<img src="media/summary/sum-6/sum-6-2.jpg" alt="" height="90px">`);
  	break;

  	case "radio3-q6":
  	$("#sum-6-img").html(`<img src="media/summary/sum-6/sum-6-3.jpg" alt="" height="90px">`);
  	break;

  	case "radio4-q6":
  	$("#sum-6-img").html(`<img src="media/summary/sum-6/sum-6-4.jpg" alt="" height="90px">`);
  	break;

  	default:
  	console.log("Error");
  }

  switch (document.querySelector('input[name="radio-q7"]:checked').id) {
  	case "radio1-q7":
  	$("#sum-7-img").html(`<img src="media/summary/sum-7/sum-7-1.jpg" alt="" height="90px">`);
  	break;

  	case "radio2-q7":
  	$("#sum-7-img").html(`<img src="media/summary/sum-7/sum-7-2.jpg" alt="" height="90px">`);
  	break;

  	case "radio3-q7":
  	$("#sum-7-img").html(`<img src="media/summary/sum-7/sum-7-3.jpg" alt="" height="90px">`);
  	break;

  	case "radio4-q7":
  	$("#sum-7-img").html(`<img src="media/summary/sum-7/sum-7-4.jpg" alt="" height="90px">`);
  	break;

  	default:
  	console.log("Error");
  }

  switch (document.querySelector('input[name="radio-q8"]:checked').id) {
  	case "radio1-q8":
  	$("#sum-8-img").html(`Legs and feet are well supported and in an evenly balanced posture.<br>
  		<img src="media/summary/sum-8/sum-8-1.jpg" alt="" height="90px">`);
  	break;

  	case "radio2-q8":
  	$("#sum-8-img").html(`Legs and feet are NOT evenly balanced and supported.<br>
  		<img src="media/summary/sum-8/sum-8-2.jpg" alt="" height="90px">`);
  	break;

  	default:
  	console.log("Error");
  }

  switch (document.querySelector('input[name="radio-q9"]:checked').id) {
  	case "radio1-q9":
  	document.getElementById("sum-9-q1").classList.remove(`sum-li`);
  	document.getElementById("sum-9-q2").classList.add(`sum-li`);
  	document.getElementById("sum-9-q3").classList.add(`sum-li`);
  	document.getElementById("sum-9-q4").classList.add(`sum-li`);
  	break;

  	case "radio2-q9":
  	document.getElementById("sum-9-q2").classList.remove(`sum-li`);
  	document.getElementById("sum-9-q1").classList.add(`sum-li`);
  	document.getElementById("sum-9-q3").classList.add(`sum-li`);
  	document.getElementById("sum-9-q4").classList.add(`sum-li`);
  	break;

  	case "radio3-q9":
  	document.getElementById("sum-9-q3").classList.remove(`sum-li`);
  	document.getElementById("sum-9-q1").classList.add(`sum-li`);
  	document.getElementById("sum-9-q2").classList.add(`sum-li`);
  	document.getElementById("sum-9-q4").classList.add(`sum-li`);
  	break;

  	case "radio4-q9":
  	document.getElementById("sum-9-q4").classList.remove(`sum-li`);
  	document.getElementById("sum-9-q1").classList.add(`sum-li`);
  	document.getElementById("sum-9-q2").classList.add(`sum-li`);
  	document.getElementById("sum-9-q3").classList.add(`sum-li`);
  	break;

  	default:
  	console.log("Error");
  }



});