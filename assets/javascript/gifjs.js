$(document).ready(function () {
    const APIkey = "WvO79Lc2QmYPAQFJNVCrzlmRWT5m94MX";
    var initTopics = JSON.stringify(["quantum", "black hole", "singularity", "STEM", "math", "physics", "gravity", "sci-fi", "technology", "engineering", "artificial intelligence"]); // This needs to be a string otherwise when I reset the giftastic.topics to initTopics, the object character makes it a reference rather than an assignment and therefore it changes with the giftastic.topics array (they are memory adress based copies of each other, both dynamically changing no matter which one is changed). Hence, I used JSON.stringify to stringify and JSON.parse to reset/reassign later on.
    var giftastic = {
        baseURL: function (SRCH) {
            return "https://api.giphy.com/v1/gifs/search" +
                "?" + $.param({
                    'api_key': APIkey,
                    'q': SRCH + "+science", // make sure that it gets the scince related stuff
                    'limit': 10,
                })
        },
        cards: [],
        first_search: true,
        topics: ["quantum", "black hole", "singularity", "STEM", "math", "physics", "gravity", "sci-fi", "technology", "engineering", "artificial intelligence"],
        oneBtn: function (btnTxt) {
            var thisbtn = $("<button>")
                .addClass("btn btn-primary m-3 border-warning topicBtn")
                .text(btnTxt)
            $("#btnDiv").append(thisbtn)
        },
        initBtns: function () {
            $("#btnDiv").empty();
            this.topics.forEach(elm => this.oneBtn(elm));
        },
        clearAll: function () {
            $("#gifDiv").empty();
        },
        clearReset: function () {
            $("#btnDiv").empty();
            $("#gifDiv").empty();                              
            this.initBtns();
        },
        getJSON: function (SRCH) {
            var url = this.baseURL(SRCH);
            $.ajax({
                url: url,
                method: 'GET',
            }).done(function (resp) {
                giftastic.dispResult(resp);                
            })
        },
        dispResult: function (resp) {
            if (this.first_search) {
                this.cards = $("#gifDiv").addClass("card-columns");
                this.first_search = false;
            }
            resp.data.forEach(function (e, i, a) {
                giftastic.cards.prepend(` 
                    <div class="card card bg-light mb-3">
                        <img class="card-img-top" src='${resp.data[i].images.fixed_height_still.url}'
                                                    src_still='${resp.data[i].images.fixed_height_still.url}'
                                                    src_anim='${resp.data[i].images.fixed_height.url}'
                                                    still='true'>
                        <h5 class="card-header">
                            Title: ${resp.data[i].title}  
                        </h5>                           
                        <div class="card-body">
                            <p class="card-text mb-1">
                                Rating: ${resp.data[i].rating.toUpperCase()}
                            </p>
                            <p class="card-text mb-1">
                            <small class="text-muted"> 
                                Size: ${resp.data[i].images.fixed_height_still.width} x ${resp.data[i].images.fixed_height_still.height} px   
                            </small>                                  
                            </p>            
                            <p class="card-text mb-1">
                            <small class="text-muted"> 
                                File Size: ${(resp.data[i].images.fixed_height.size/1000000).toPrecision(2)} Mb   
                            </small>                                  
                            </p>                   
                        </div>
                        <div class="card-footer">
                            <p class="card-text"><small class="text-muted">Embed:<a href='${resp.data[i].embed_url}' target="_blank">
                                ${resp.data[i].embed_url}</a></small>
                            </p>
                        </div>
                    </div>
                    `)
            })
        }
    }



    giftastic.initBtns();


    //function of topic button
    $("#btnDiv").on("click",".topicBtn", function () {
        var SRCH = $(this).text();
        giftastic.getJSON(SRCH);
    })

    // function of search button
    $("#searchBTN").on("click", function (event) {
        event.preventDefault();
        var btnTxt = $("#search").val().trim();
        giftastic.topics.push(btnTxt);
        console.log(initTopics);
        giftastic.initBtns();
        $("#search").val("")
    })

    // function of gif click
    $("#gifDiv").on("click",".card-img-top", function () {
        if ($(this).attr("still") === "true") {
            $(this).attr("still", "false");
            $(this).attr("src", $(this).attr("src_anim"));
        } else {
            $(this).attr("still", "true");
            $(this).attr("src", $(this).attr("src_still"));
        }
    })
    
    // function of clear button
    $("#clearBTN").on("click", function () {
        event.preventDefault();
        giftastic.clearAll();
    });

    // function of reset button
    $("#resetBTN").on("click", function () {
        event.preventDefault();        
        giftastic.topics=JSON.parse(initTopics);       
        giftastic.clearReset();           
    });
})
