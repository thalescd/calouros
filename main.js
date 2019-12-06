var mainApp = {};

(function () {
    var uid = null;

    function messageHandler(err) {
        if (!!err) {
            alert("Erro ao conectar ao banco de dados!");
        } else {
            alert("Operação feita com sucesso!");
        }
    }

    function getData(divName) {
        var inputText = document.getElementById(divName).getElementsByTagName('input');
        var inputTextArea = document.getElementById(divName).getElementsByTagName('textarea');
        var i;
        var data = {};
        for (i = 0; i < inputText.length; i++) {
            if (inputText[i].value.length != 0 && inputText[i].type != 'radio') {
                data[inputText[i].name] = inputText[i].value;
            } else if (inputText[i].type == 'radio') {
                data[inputText[i].name] = document.querySelector('input[name="' + inputText[i].name + '"]:checked').value;
            } else {
                if (inputText[i].id.includes("_")) {
                    return false;
                }
            }
        }
        for (i = 0; i < inputTextArea.length; i++) {
            if (inputTextArea[i].value.length != 0) {
                data[inputTextArea[i].name] = inputTextArea[i].value;
            } else {
                if (inputTextArea[i].id.includes("_")) {
                    return false;
                }
            }
        }
        //console.log(data);
        return data;
    }

    function fnCreate() {
        var path = 'curriculos/' + uuidv4();
        var data = getData('divCrud');
        if (data != false) {
            app_fireBase.databaseApi.create(path, data, messageHandler);
            fnRead();
        } else {
            alert("Preencha todos os campos obrigatórios.");
        }
    }

    function fnRead() {
        document.getElementById("divResult").innerHTML = '<div id="divRow" class="row"></div>';
        var path = "curriculos";
        app_fireBase.databaseApi.read(path, successFn, messageHandler);
        function successFn(snapShot) {
            if (!!snapShot && !!snapShot.val()) {
                snapShot.forEach(function (childSnapshot) {
                    printCard(childSnapshot.val(), childSnapshot.key);
                    //document.getElementById("divResult").innerHTML = document.getElementById("divResult").innerHTML + '</div>';
                });
            } else {
                console.log("No data found");
            }
        }
    }

    function fnReadById(id) {
        //var ul = document.createElement('ul');
        //ul.classList.add('collection');
        //ul.id = 'ulResult';
        
        var path = "curriculos/" + id;
        app_fireBase.databaseApi.read(path, successFn, messageHandler);
        function successFn(snapShot) {
            if (!!snapShot && !!snapShot.val()) {
                printAllResults(snapShot.val(), 'ulResult');
                //document.getElementById('divResult').append(ul);
            } else {
                console.log("No data found");
            }
        }
    }

    function fnReadComments(id) {
        document.getElementById("ulComment").innerHTML = '';
        var path = "curriculos/" + id + '/comentarios';
        var i = 0;
        app_fireBase.databaseApi.read(path, successFn, messageHandler);
        function successFn(snapShot) {
            if (!!snapShot && !!snapShot.val()) {
                snapShot.forEach(function (childSnapshot) {
                    var node = document.createElement("LI");
                    node.classList.add('collection-item');
                    node.id = 'liComment' + i;
                    document.getElementById('ulComment').append(node);
                    printComment(childSnapshot.val(), node.id);
                    i++;
                });
                document.getElementById('nComments').innerHTML = i;
            } else {
                console.log("No data found");
            }
        }
    }

    function fnUpdate() {
        //TODO
        var path = 'curriculos/' + uuidv4();
        var data = {
            nome: "Thales",
            idade: 21
        };
        app_fireBase.databaseApi.update(path, data, messageHandler);
    }

    function fnDelete() {
        //TODO
        var path = 'curriculos/' + uuidv4();
        app_fireBase.databaseApi.delete(path, messageHandler);
    }

    mainApp.Create = fnCreate;
    mainApp.Read = fnRead;
    mainApp.ReadById = fnReadById;
    mainApp.Update = fnUpdate;
    mainApp.Delete = fnDelete;
    mainApp.CreateComment = createComment;
    mainApp.ReadComment = fnReadComments;

    //https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function printAllResults(data, ulName) {
        for (prop in data) {
            if (typeof data[prop] != 'object') {
                var node = document.createElement("LI");
                var textnode = document.createTextNode(prop + ': ' + data[prop]);
                node.append(textnode);
                node.classList.add('collection-item');
                document.getElementById(ulName).append(node);
            }
        }
    }

    function printComment(data, liName) {
        //console.log(liName);
        for (prop in data) {
            var textnode = document.createTextNode(prop + ': ' + data[prop]);
            document.getElementById(liName).append(textnode);
            document.getElementById(liName).append(document.createElement('br'));
        }
    }

    function printCard(data, id) {
        var x = document.getElementById("divRow");
        x.innerHTML = x.innerHTML +
            '<div class="col s12 m6">' +
            '<div class="card blue-grey darken-1 autobl">' +
            '<div class="card-content white-text">' +
            '<span class="card-title">' + data['Nome'] + '</span>' +
            '<p>Nº de contato: ' + getCelular(data) + '</p>' +
            '</div>' +
            '<div class="card-action">' +
            '<a href="curriculo.html?id=' + id + '">Ver mais</a>' +
            '</div></div></div>';
    }

    function getCelular(data) {
        if (data['Celular'] != undefined) {
            return data['Celular'];
        }
        return "";
    }

    function createComment() {
        var url = new URLSearchParams(window.location.search);
        var id = url.get("id");
        var path = 'curriculos/' + id + '/comentarios/' + uuidv4();
        var data = getData('divNewComment');
        if (data != false) {
            app_fireBase.databaseApi.create(path, data, messageHandler);
            fnReadComments(id);
        } else {
            alert("Preencha todos os campos obrigatórios.");
        }
    }

})()