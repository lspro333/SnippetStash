
/////////////////////////////////////////////////////////////code for filtering by categoryID & userID
$(document).ready(function () {
    var url = window.location.search;
    var dir = window.location.pathname;
    var stashForm = $("#stash-form");
    var titleInput = $("#SnippetTitle");
    var publicPrivate;
    var contentInput = $("#snippetCode");
    var descriptionInput = $("#snippetDescription");
    var usrName = $(".member-id");
    var catId = $("#snippetCategory");
    var snippetArea = $('.snippet-list');
    // var header = $("#categoryHdr");
    var header = $("#snippetHdr");


    loadUserData();
    //get user data & set welcome header
    function loadUserData() {
        $.get("/api/user_data").then(function (data) {
            $(".member-name").text(data.email);
            $(".member-id").text(data.id);
            var uid = data.id;
            getMember(uid);
        });
    }


    //pass member id it use it to return snippets
    function getMember(uid) {
        memberId = uid;
        if (url.indexOf("?catId=") !== -1) {
            catId = url.split("=")[1];
            if (dir === "/public") {
                getAllSnippetsByCategory(catId);
            } else {
                getMemberSnippetsByCategory(catId);
            }

        }
        else {
            //displays first category snippets as default view
            catId = 1;
            if (dir === "/public") {
                getAllSnippetsByCategory(catId);
            } else {
                getMemberSnippetsByCategory(catId);
            }
        }

    }

    function getAllSnippetsByCategory(id) {
        $.get("/api/snippets/" + id, function (data) {
            var itemToAdd = [];
            for (var i = 0; i < data.length; i++) {
                itemToAdd.push(renderSnippets(data[i]));
            }
            getCatName(id);
        });
    }

    function getMemberSnippetsByCategory(id) {
        $.get("/api/user/snippets/" + id, function (data) {
            var itemToAdd = [];
            for (var i = 0; i < data.length; i++) {
                itemToAdd.push(renderSnippets(data[i]));
            }
            getCatName(id);
        });
    }

    function getAllSnippetsByQuery(qparam) {
        $('#append-to-me').empty();
        var queryURL;
        if (dir === "/public") {
            queryURL = "/api/find/public/snippets/";
        } else {
            queryURL = "/api/find/member/snippets/";
        }

        $.get(queryURL + qparam, function (data) {
            var itemToAdd = [];
            for (var i = 0; i < data.length; i++) {
                itemToAdd.push(renderSnippets(data[i]));
            }

            header.text("Snippets search results");
        });

    }


    function getCatName(id) {
        $.get("/api/categories/" + id, function (data) {
            header.append(data.catName + " Snippets");
        });
    }

    function renderSnippets(itemToAdd) {
        var newPanelHeading = $('<div class="panel ">').appendTo('#append-to-me');
        if (dir === "/public") {
            newPanelHeading.append(`
            <div class='col-lg-11 col-lg-12'>
            <div class='panel-group' id='accordion${itemToAdd.id}'>
                <div class='panel'>
                    <div class='panel panel-primary'>
                        <div class='panel-heading'>
                            <div class='row'>
                                <div class='col-xs-9 '>
                                    <div class='huge'>${itemToAdd.snippetTitle}
                                    </div>
                                    <div>${itemToAdd.snippetDescription}
                                    </div>
                                </div>
                                <div class='col-xs-3 text-right'>
                                    <button class='snip-btn'>
                                        <i class="fas fa-cut snip-it" id='${itemToAdd.id}' title="Snip-it to add to your library"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class='snippetDetails'>
                            <div class='panel-group' id='accordion${itemToAdd.id}'>
                                <div class='panel panel-info'>
                                    <div class='panel-heading'>
                                        <h4 class='panel-title'>
                                            <a data-toggle='collapse' data-parent='#accordion${itemToAdd.id}' href='#collapse${itemToAdd.id}'>
                                                <span class='glyphicon glyphicon-plus'></span>View Details
                                            </a>
                                        </h4>
                                    </div>
                                    <div id='collapse${itemToAdd.id}' class='panel-collapse collapse'>
                                        <div class='panel-body'>
                                            <div class='well'>
                                                <textarea class='form-control' id='copy${itemToAdd.id}' rows='11'>${itemToAdd.snippetContent}</textarea>
                                                <button class="copy-btn" data-clipboard-target="#copy${itemToAdd.id}" data-toggle="tooltip" data-placement="bottom">
                                                    <img src="../images/clippy.svg" alt="Copy to Clipboard">
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class='panel panel-info'>
                                    <div class='panel-heading'>
                                        <h4 class='panel-title'>
                                            <a data-toggle='collapse' data-parent='#accordion${itemToAdd.id}' href='#collapseTwo${itemToAdd.id}'>
                                                <span class='glyphicon glyphicon-plus'></span>Comments
                                            </a>
                                        </h4>
                                    </div>
                                    <div id='collapseTwo${itemToAdd.id}' class='panel-collapse collapse'>
                                        <div class='panel-body'>
                                            <a href='#' class='btn btn-success' data-toggle='modal' data-target='#commentModal'>Add
                                                a Comment</a>
                                            <div>
                                                <br>
                                            </div>
                                            <div id="commentsSaved" class='well'>
                                                <p>Comments go here.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            `);
        } else {

            newPanelHeading.append(`
            <div class='col-lg-11 col-lg-12'>
                <div class='panel-group' id='accordion${itemToAdd.id}'>
                    <div class='panel'>
                        <div class='panel panel-primary'>
                            <div class='panel-heading'>
                                <div class='row'>
                                    <div class='col-xs-9'>
                                        <div class='huge'>${itemToAdd.snippetTitle}
                                        </div>
                                        <div>${itemToAdd.snippetDescription}
                                        </div>
                                    </div>
                                    <div class='col-xs-3 text-right'>
                                        <button class='snip-btn'>
                                            <i class="trash-it fas fa-trash-alt" id='${itemToAdd.id}' title='Delete this snippet'></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class='snippetDetails'>
                                <div class='panel-group' id='accordion${itemToAdd.id}'>
                                    <div class='panel panel-info'>
                                        <div class='panel-heading'>
                                            <h4 class='panel-title'>
                                                <a data-toggle='collapse' data-parent='#accordion${itemToAdd.id}' href='#collapse${itemToAdd.id}'>
                                                    <span class='glyphicon glyphicon-plus'></span>View Details
                                                </a>
                                            </h4>
                                        </div>
                                        <div id='collapse${itemToAdd.id}' class='panel-collapse collapse'>
                                            <div class='panel-body'>
                                                <div class='well'>
                                                    <textarea class='form-control' id='copy${itemToAdd.id}' rows='11'>${itemToAdd.snippetContent}</textarea>
                                                    <button class="copy-btn" data-clipboard-target="#copy${itemToAdd.id}" data-toggle="tooltip" data-placement="bottom">
                                                        <img src="../images/clippy.svg" alt="Copy to Clipboard">
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='panel panel-info'>
                                        <div class='panel-heading'>
                                            <h4 class='panel-title'>
                                                <a data-toggle='collapse' data-parent='#accordion${itemToAdd.id}' href='#collapseTwo${itemToAdd.id}'>
                                                    <span class='glyphicon glyphicon-plus'></span>Comments
                                                </a>
                                            </h4>
                                        </div>
                                        <div id='collapseTwo${itemToAdd.id}' class='panel-collapse collapse'>
                                            <div class='panel-body'>
                                                <a href='#' class='btn btn-success' data-toggle='modal' data-target='#commentModal'>Add
                                                    a Comment</a>
                                                <div>
                                                    <br>
                                                </div>
                                                <div id="commentsSaved" class='well'>
                                                    <p>Comments go here.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `);
        }
    }

    // var tooltip = $('[data-toggle="tooltip"]')
    // tooltip.toArray().forEach(function (element) {
    //     $(element).tooltip({
    //         title: "Copy to Clipboard",
    //         delay: {
    //             "show": 500,
    //             "hide": 500
    //         }
    //     });
    // });



    snippetArea.on('click', '.copy-btn', function () {
        var clipboard = new ClipboardJS('.copy-btn', {
            target: function (trigger) {
                return trigger.previousElementSibling;
            }
        });

        var tooltip = $('[data-toggle="tooltip"]')
        tooltip.toArray().forEach(function (element) {
            $(element).tooltip({
                title: "Copied!",
                delay: {
                    "show": 100,
                    "hide": 3000
                }
            });
        });
    });

    //form submission
    $(stashForm).on("submit", function handleFormSubmit(event) {
        event.preventDefault();
        var catId = $("#snippetCategory");
        if ($('#public').is(':checked')) {
            publicPrivate = true;
        } else { publicPrivate = false; }
        // Wont submit the snippet if we are missing title, content, or username
        if (!titleInput.val().trim() || !contentInput.val().trim() || !usrName.text()) {
            console.log("Form Fields need to be completed!!!")
            console.log("Title Input: " + titleInput.val().trim());
            console.log("Snippet Code: " + contentInput.val().trim());
            console.log("Member ID: " + usrName.text());
            return;
        }
        // Constructing a newSnippet object to hand to the database
        var newSnippet = {
            snippetTitle: titleInput.val().trim(),
            snippetContent: contentInput.val().trim(),
            snippetDescription: descriptionInput.val().trim(),
            public: publicPrivate,
            CategoryId: catId.val(),
            UserId: usrName.text()
        };
        insertSnippet(newSnippet);

    });

    function insertSnippet(newSnippet) {
        console.log(publicPrivate);
        var cid = newSnippet.CategoryId;
        var mid = newSnippet.UserId;
        $.post("/api/snippets", newSnippet, function () {
            window.location.href = dir + "?catId=" + cid + "&userId=" + mid;
        });
    };

    //snippet save to personal - 
    $(document).on("click", ".snip-it", handleSnippetSave);
    function handleSnippetSave() {
        event.preventDefault();
        var curSnippet = $(this).attr('id');
        var member = $(".member-id");
        // console.log(curSnippet);
        saveSnippet(curSnippet);
    }

    // This function does an API call to add snippets to personal stash
    function saveSnippet(snippetID) {
        // alert("curSnippet: " + snippetID);
        console.log('SNIPPET SAVED :' + snippetID)
    }


    //snippet deletion
    $(document).on("click", ".trash-it", handleSnippetDelete);
    function handleSnippetDelete() {
        event.preventDefault();
        var curSnippet = $(this).attr('id');
        var member = $(".member-id");
        console.log(curSnippet);
        console.log("Member: " + member);
        deleteSnippet(curSnippet);
    }

    // This function does an API call to delete snippetts
    function deleteSnippet(id) {
        $.ajax({
            method: "DELETE",
            url: "/api/snippets/delete/" + id
        }).then(location.reload());
    }

    //snippet search
    //1st code block handles an enter click event on the search text box
    $('#searchBox').bind('keyup', function (e) {
        if (e.keyCode === 13) { // 13 is enter key    
            var searchParam = $("#searchBox").val().trim();
            getAllSnippetsByQuery(searchParam);
        }
    });
    $(document).on("click", ".btn-default", handleSnippetSearch);
    function handleSnippetSearch() {
        event.preventDefault();
        var searchParam = $("#searchBox").val().trim();
        getAllSnippetsByQuery(searchParam);
        // alert(searchParam);
    }


});//end document.ready function

