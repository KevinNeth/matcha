function url() {
    var url = window.location.href;
    url = url.split("/");
    return (url[0] + '//' + url[2] + '');
}

/*<form action="/myaccount/modifLocation" method="post">
    <div class="row">
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div class="input-group">
                <input type="text" class="form-control" name="location" id="pac-input" placeholder="Insert new location" required>
                <span class="input-group-btn" style="height:37px">
                    <input class="btn btn-secondary" type="submit" value="Change Location">
                </span>
            </div>
        </div>
    </div>
</form>*/

let allchange = Array.from(document.getElementsByClassName('change'));
allchange.forEach(function (change) {
    change.addEventListener("click", function () {
        let parent = change.parentNode.parentNode;
        let id = change.id;
        while (parent.hasChildNodes()) {
            parent.removeChild(parent.lastChild);
        }
        
        let input = document.createElement('input');
        input.setAttribute("type", "submit");
        input.setAttribute("value", "Change " + id);
        input.classList.add("btn", "btn-secondary");

        let input2 = document.createElement('input');
        input2.setAttribute("type", "text");
        input2.setAttribute("class", "form-control");
        input2.setAttribute("name", id);

        let span = document.createElement("span");
        span.setAttribute("class", "input-group-btn");
        span.setAttribute("style", "height: 37px");
        span.appendChild(input);

        inputdiv = document.createElement("div");
        inputdiv.setAttribute("class", "input-group");
        inputdiv.appendChild(input2);
        inputdiv.appendChild(span);

        let classdiv = document.createElement("div");
        classdiv.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12", "col-xl-12");
        classdiv.appendChild(inputdiv);

        let rowdiv = document.createElement("div");
        rowdiv.setAttribute("class", "row");
        rowdiv.appendChild(classdiv);
        
        let form = document.createElement('form');
        form.setAttribute("action", "myaccount/submit");
        form.setAttribute("method", "post");
        form.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12", "col-xl-12");
        form.appendChild(rowdiv);

        parent.appendChild(form);
    });
});

let changeGO = Array.from(document.getElementsByClassName('changeGO'));
changeGO.forEach(function (change) {
    change.addEventListener("click", function () {
        let parent = change.parentNode.parentNode;
        console.log(parent);
        let id = change.id;
        console.log(id);
        while (parent.hasChildNodes()) {
            parent.removeChild(parent.lastChild);
        }

        let select = document.createElement('select');
        select.setAttribute("class", "custom-select")
        select.setAttribute("name", id);

        let man = document.createElement('option');
        man.setAttribute("value", "man");
        let textman = document.createTextNode("man");
        man.appendChild(textman);
        select.appendChild(man);

        let woman = document.createElement('option');
        woman.setAttribute("value", "woman");
        let textwoman = document.createTextNode("woman");
        woman.appendChild(textwoman);
        select.appendChild(woman);

        if (id === "orientation") {
            let both = document.createElement('option');
            both.setAttribute("value", "both");
            let textboth = document.createTextNode("both");
            both.appendChild(textboth);
            select.appendChild(both);
        }

        let input = document.createElement('input');
        input.setAttribute("type", "submit");
        input.setAttribute("class", "btn btn-primary");
        input.setAttribute("value", "Change");

        let form = document.createElement('form');
        form.setAttribute("action", "myaccount/submit");
        form.setAttribute("method", "post");
        form.appendChild(select);
        form.appendChild(input);

        let div = document.createElement("div");
        div.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12", "col-xl-12", "text-right");
        div.appendChild(form);
        parent.appendChild(div);
    })
})

let deleteInter = Array.from(document.getElementsByClassName('deleteInter'));
deleteInter.forEach(function (inter) {
    let id = inter.id;
    inter.addEventListener("click", function () {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url() + '/myaccount/deleteInterest', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send('id=' + id);
        let parent = inter.parentNode;
        parent.removeChild(inter);
    });
});