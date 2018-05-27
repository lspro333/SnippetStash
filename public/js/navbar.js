$(document).ready(function () {
    getCategories();
    function getCategories() {
        $.get("/api/categories", function (data) {
            var itemToAdd = [];
            for (var i = 0; i < data.length; i++) {
                itemToAdd.push(renderNavbarList(data[i]));
            }
        });
    }

    function renderNavbarList(itemToAdd) {
    var newLi = $("<li/>").appendTo('#side-menu');
    var id = itemToAdd.id;
    newLi.data("category", itemToAdd);
    newLi.attr("id", id);
    // newLi.append("<a href='"+url+"' ><i class='fa  fa-fw'></i>" +itemToAdd.catName + "<span></span> </a>");
    newLi.append("<a href='#' ><i class='fa  fa-fw'></i>" +itemToAdd.catName + "<span></span> </a>");
    return newLi;
    }

});




