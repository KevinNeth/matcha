function url(){
	var url =  window.location.href;
	url = url.split("/");
	return(url[0] + '//' + url[2] + '');
}

let allchange = Array.from(document.getElementsByClassName('change'));
allchange.forEach(function(change) {
    change.addEventListener("click", function() {
        let parent = change.parentNode.parentNode;
        let id =  change.id;
        while (parent.hasChildNodes()) {
            parent.removeChild(parent.lastChild);
        }
        let input = document.createElement('input');
        input.setAttribute("type", "submit");
        input.setAttribute("value","change");
        let input2 = document.createElement('input');
        input2.setAttribute("type", "text");
        input2.setAttribute("name", id);
        
        let form = document.createElement('form');
        form.setAttribute("action", "myaccount/submit");
        form.setAttribute("method", "post");

        form.appendChild(input2);
        form.appendChild(input);
        let halfdiv = document.createElement("div");
        halfdiv.classList.add("col-6", "col-sm-6", "col-md-6", "col-lg-6", "col-xl-6");
        halfdiv.appendChild(form);
        parent.appendChild(halfdiv);
    });
});

let changeGO = Array.from(document.getElementsByClassName('changeGO'));
changeGO.forEach(function(change) {
    change.addEventListener("click", function() {
        let parent = change.parentNode.parentNode;
        console.log(parent);
        let id =  change.id;
        console.log(id);
        while (parent.hasChildNodes()) {
            parent.removeChild(parent.lastChild);
        }

        let select = document.createElement('select');
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
        input.setAttribute("value","change");

        let form = document.createElement('form');
        form.setAttribute("action", "myaccount/submit");
        form.setAttribute("method", "post");
        form.appendChild(select);
        form.appendChild(input);

        let halfdiv = document.createElement("div");
        halfdiv.classList.add("col-6", "col-sm-6", "col-md-6", "col-lg-6", "col-xl-6");
        halfdiv.appendChild(form);
        parent.appendChild(halfdiv);
    })
})

let deleteInter = Array.from(document.getElementsByClassName('deleteInter'));
deleteInter.forEach(function(inter) {
    let id = inter.id;
    inter.addEventListener("click", function() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url() + '/myaccount/deleteInterest', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send('id=' + id);
        let parent = inter.parentNode;
        parent.removeChild(inter);
    });
});