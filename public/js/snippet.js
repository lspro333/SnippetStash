$(document).ready(function () {

    var url = window.location.search;
    var dir = window.location.pathname;
    if (url.indexOf("?catId=") !== -1) {
        catId = url.split("=")[1];        
        getAllSnippetsByCategory(catId);
      }
    else{
        catId = 1;
        getAllSnippets(catId);;
    }
    
    var titleInput = $("#SnippetTitle");
    var contentInput = $("#snippetCode");
    var stashForm = $("#stash-form");
    var catId = $("#snippetCategory");
    var usrName = $(".member-id");
    


    $(stashForm).on("submit", function handleFormSubmit(event) {
        event.preventDefault();
        // Wont submit the post if we are missing a name or a password
        if (!titleInput.val().trim() || !contentInput.val().trim() || !usrName.text()) {
            console.log("Form Fields need to be completed!!!")
            console.log("Title Input: " + titleInput.val().trim());
            console.log("Snippet Code: " + contentInput.val().trim());
            console.log("Member Email: " + usrName.text());
            return;
        }
        // Constructing a newPost object to hand to the database
        var newSnippet = {
            snippetTitle: titleInput.val().trim(),
            snippetContent: contentInput.val().trim(),
            CategoryId: catId.val(),
            UserId: usrName.text()
        };

        insertSnippet(newSnippet);

    });

    function insertSnippet(newSnippet) {
        console.log("Title Input: " + titleInput.val().trim());
        console.log("Snippet Code: " + contentInput.val().trim());
        console.log("Member Email: " + usrName.text());
        $.post("/api/snippets", newSnippet, function () {
            window.location.href = dir +"?catId=" + catId.val();
        });
    };

    function getAllSnippetsByCategory(id) {
        $.get("/api/snippets/" +id, function (data) {
            var itemToAdd = [];
            for (var i = 0; i < data.length; i++) {
                itemToAdd.push(renderSnippets(data[i]));
            }
        });
    }

    //function to return snippets when navbar link clicked
    function getAllSnippets() {
        $.get("/api/snippets", function (data) {
            var itemToAdd = [];
            for (var i = 0; i < data.length; i++) {
                itemToAdd.push(renderSnippets(data[i]));
            }
        });
    }

    function renderSnippets(itemToAdd) {
        // var newLi = $("<h4>").appendTo('#accordion');
        // newLi.data("snippet", itemToAdd);
        // newLi.append("<a href='/'><i class='fa  fa-fw'></i>" + itemToAdd.snippetTitle + "<span></span> </a>");
        // return newLi;
        var newPanelHeading = $('<div class="panel panel-default">').appendTo('#append-to-me');
        newPanelHeading.append("<h4 class='panel-title'> <a data-toggle='collapse' data-parent='#accordion' href='#collapseOne'>" + itemToAdd.snippetTitle + "</a></h4> </br>");
        newPanelHeading.append("<h4 class='panel-title'> <a data-toggle='collapse' data-parent='#accordion' href='#collapseOne'>" + itemToAdd.snippetContent + "</a></h4> </br>");
        return newPanelHeading;


    }

});//end document.ready function
