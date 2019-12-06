var app_fireBase = {};
(function () {

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyCHzt33x3Y0TYkAE8TYMJBpbqppYMQ6nMg",
        authDomain: "curriculer-f5401.firebaseapp.com",
        databaseURL: "https://curriculer-f5401.firebaseio.com",
        projectId: "curriculer-f5401",
        storageBucket: "curriculer-f5401.appspot.com",
        messagingSenderId: "623091309295",
        appId: "1:623091309295:web:0fa5cdb78f161c2d06591a",
        measurementId: "G-XY1G92HF4P"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    app_fireBase = firebase;

    function fnCreate(path, body, callBack) {
        if (!path || !body) return;
        app_fireBase.database().ref(path).set(body, callBack);
    }

    function fnRead(path, succFunction, errFunction) {
        if (!path || !succFunction || !errFunction) return;
        app_fireBase.database().ref(path).once('value').then(succFunction, errFunction);
    }

    function fnUpdate(path, body, callBack) {
        if (!path || !body) return;
        app_fireBase.database().ref(path).update(body, callBack);
    }

    function fnDelete(path, callBack) {
        if (!path) return;
        app_fireBase.database().ref(path).remove(callBack);
    }

    app_fireBase.databaseApi = {
        create: fnCreate,
        read: fnRead,
        update: fnUpdate,
        delete: fnDelete
    }
})()