//document ready function to run all of the code inside it only once page has finished loading
$(document).ready(function() {

  var wikiText = ''; //string-- can it be an array?
  var stripped = '';
  var searchTerm = '';
  var topic = document.getElementsByClassName("topic");
  var frequencies = '';

  function removeHTMLTagsAndOutputResults() {
    //wikiText.replace(/<(?:.|\n)*?>/gm, '');
    stripped = wikiText.replace(/<.*?>/g, ' ');
    stripped = stripped.replace(/[^\w\s]/gi, '');
    stripped = stripped.replace(/[0-9]/g, '');

    // console.log(stripped);
   	// console.log(getFrequency(stripped, 3));
  	// $("#output").html(getFrequency(stripped, 3));

  	$("#output").html(getFrequency(stripped, 9).join(' ') ); //9 most common words

	  	$("#output").each(function() {					///to put resulting words 3 words by 3 rows
		    var html = $(this).html().split(" ");
		    html = html.slice(0,3).join(", ") + "<br />" 
			    + html.slice(3, 6).join(", ") + "<br />" 
			    + html.slice(6).join(", ") ;
		    $(this).html(html);
			});
  };
  removeHTMLTagsAndOutputResults();


	//formatting syntax of jquery function in plain vanilla javascript:

	 	// function bindListener()	 {
	 		// $("#something").on("click", function(e) {
	 			// e.which;
	 		// });
	 	// }

	 	// bindListener();


			////make enter key work 
	    ////so function works on enter key
	    // $("#btnEnterSearchTerm").on("submit", function() {
	    //   alert("FORM WAS SUBMITTED");
	    //   return false; //Otherwise the form will be submitted
	    // });

// $('.input').keypress(function(e) {
//   if (e.which == 13) {
//     $('form#login').submit();
//     return false;    //<---- Add this line
//   }
// });

///

	function searchWikiData() {
	 	$("#btnEnterSearchTerm").on("click", function(event) {
	 		
	 		searchTerm = $("#searchTerm").val();

	 		if (searchTerm == "") searchTerm = "nothing";

	 		for (i = 0; i < topic.length; i++) {
	 			topic[i].textContent = searchTerm;
	 		}

	    console.log("url location");
	    var url = "https://en.wikipedia.org/w/api.php?action=parse&&prop=text&format=json&callback=?&redirects&page=" + searchTerm; //adding &redirects
	    
	    //var url = "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&&titles=" + searchTerm +"&format=json&callback=?";
	    //var url = "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&&titles=" + searchTerm; //pizza";
	    $.ajax({
	    	url: url,
	    	type: 'GET',
	    	contentType: "application/json; charset=utf-8",
	    	async: false,
	    	dataType: "json",
	        success: function(data, status, jqXHR) {
	          //console.log(data);
	          wikiText = data.parse.text["*"];
	          console.log("success func");
	          removeHTMLTagsAndOutputResults(); // calls function above to remove html tags and return wiki data

	          // console.log(data[1][1]);
	          //console.log(data[3][0]);

	          // $("#output").html();
	          // for(var i=0;i<data[1].length;i++){
	          //     //$("#output").prepend("<div><a href="+data[3][i]+"><h2>" + data[1][i]+ "</h2>" + "<p>" + data[2][i] + "</p></a></div></div>");
	          // }
	        }
	      })
	    .done(function() {
	    	console.log("success");
	    })
	    .fail(function() {
	    	console.log("error");
	    })
	    .always(function() {
	    	console.log("complete");
	    });

	  });
	};
	searchWikiData(); //calls function, searchWikiData

//function to make enter key submit like button click
   // $(function () {

   //          // $('#text').keypress(function (event) {
   //          //     if (event.which == 13) {
   //          //         alert("enter pressed");
   //          //         //return false;
   //          //     }
   //          // });

   //          // $("#btn").click(function () {
   //          //     var e = jQuery.Event('keypress');
   //          //     e.which = 13; // #13 = Enter key
   //          //     $("#address").focus();
   //          //      alert("button pressed");
   //          // });
       
   //          $("#sub").on("submit", function(){
   //          	//searchWikiData(); //calls function searchWikiData() on enter key
   //      			alert("FORM WAS SUBMITTED");
			// 	        return false; //Otherwise the form will be submitted
   //  				});

   //      });


	function getFrequency(string, cutOff) {

	    var cleanString = string.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/gi, ""), //i ignores case?
	       //make all wikiText lowercase
	       frequencies = {},
	       word, frequency, i;

	    var wikiText = cleanString.toLowerCase().split(' ');

	    for (i = 0; i < wikiText.length; i++) {
	    	word = wikiText[i];
	    	frequencies[word] = frequencies[word] || 0;
	    	frequencies[word]++;
	    }

	    var exceptions = ["may", "were", "than", "been", "its", "them", "has", "him", "her", "his", "she", "most", "some", "all", "but", "also", "pdf", "such", "many", "edit", "not", "isbn", "which", "can", "the", "have", "they", "that", "for", "and", "from", "about", "with", "doi", "this", "their", "there", "retrieved", "was", "list", "are", "pmid", "new", searchTerm, searchTerm+"s", searchTerm+"es"];

	    // console.log(frequencies);

	    //delete words with less than 3 letters
	    for (key in frequencies) {
	    	if (key.length < 3) {
	    		delete frequencies[key];
	    	}
			// loop over exceptions array, 
			//and if the key matches one of the exceptions, delete it from the object
				for (i = 0; i < exceptions.length; i++) {
					if (key == exceptions[i]) {
						delete frequencies[key];
					}
				}
			}
			console.log(frequencies);

			wikiText = Object.keys(frequencies);

				return wikiText.sort(function(a, b) {
					return frequencies[b] - frequencies[a];
				}).slice(0, cutOff);
	};
	$("#output").html(frequencies); //print resulting most frequent to html



	//Search for images via Flickr
	function searchFlickr()	 {
		$("#btnEnterSearchTerm").click(function(){
			$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
			{
				tags: $("#searchTerm").val(),
				tagmode: "any",
				format: "json",
				per_page: 1
			},

			function(data) {
				$.each(data.items, function(i,item){

			    //remove the last img from results, before prepending new image
			    $("#results img:last-child").remove();

			    //prepend new image
			    $("<img/>").empty().attr("src", item.media.m).prependTo("#results");
			    if ( i == 0 ) return false;
		     });
			});
		});
	};
	searchFlickr(); //calls function, searchFlickr

}); ///closes document ready function, but why not underlining?




//////////////<<<<<<<<<<<<-----------------

// for final project:

// Just the Gist

// pull data from wikipedia via API

// have search bar under space for image

// when user types in text,

// return 3 words (or 5 or 9 or 10)

// app requests data from wikipedia based on whatever was searched for,
// sorts words for most frequently used words, : sort/splice/map?
// excludes search term, -- filter
// excludes common articles -- filter: (a, the, that, ... etc)

// also returns random images from google image search.

// make three words fadeIn, make page look pretty w other css

// x

// perhaps if time:

// also include 3 words from another source, below wikipedia results.

// ex:

// (returned random image)

// search bar

// wikipedia: one, two, three
// google: one, two, three
// dictionary.com: one, two, three

// (or some other data sources)

//zzz