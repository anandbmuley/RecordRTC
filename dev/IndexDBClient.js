function IndexDBClient(filename) {
    this.dbName = "video_chunks_db";
    this.filename = filename;
    this.dbVersion = 1;
    this.db = null;
}

IndexDBClient.prototype.initialize = function() {
    var self = this;
    var openRequest = indexedDB.open(this.dbName, this.dbVersion);

    openRequest.onupgradeneeded = function(event) {
        var db = event.target.result;
        if (!db.objectStoreNames.contains("videos")) {
            db.createObjectStore("videos", {
                keyPath: "filename",
            });
        }
    };

    openRequest.onsuccess = function(event) {
        self.db = event.target.result;
    };

    openRequest.onerror = function(event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };
};

IndexDBClient.prototype.put = function(arrayOfBlobs) {
    if (!this.db) {
        console.error("IndexedDB is not initialized");
        return;
    }

    var transaction = this.db.transaction(["videos"], "readwrite");
    var store = transaction.objectStore("videos");
    var existingRecord = store.get(this.filename);

    if (existingRecord) {
        console.error("Record with the same filename already exists");
        return;
    }

    var record = {
        filename: this.filename,
        content: arrayOfBlobs,
        createdOn: new Date(),
        lastUpdatedOn: new Date(),
        status: "done",
    };

    var request = store.add(record);

    request.onerror = function(event) {
        console.error("Error adding record:", event.target.error);
    };

    request.onsuccess = function(event) {
        console.log("Record added successfully");
    };
};

IndexDBClient.prototype.stats = function() {
    if (!this.db) {
        console.error("IndexedDB is not initialized");
        return;
    }

    var transaction = this.db.transaction(["videos"], "readonly");
    var store = transaction.objectStore("videos");
    var record = store.get(this.filename);

    if (!record) {
        console.error("Record not found");
        return;
    }

    console.log("Filename:", record.filename);
    console.log("Created On:", record.createdOn);
    console.log("Last Updated On:", record.lastUpdatedOn);
    console.log("Content Size:", record.content.length);
    console.log("Status:", record.status);
};

IndexDBClient.prototype.getData = function() {
    if (!this.db) {
        console.error("IndexedDB is not initialized");
        return;
    }

    var transaction = this.db.transaction(["videos"], "readonly");
    var store = transaction.objectStore("videos");
    var record = store.get(this.filename);

    if (!record) {
        console.error("Record not found");
        return;
    }

    var content = record.content;
    var completeBlob = new Blob(content, {
        type: "video/mp4",
    });
    return completeBlob;
};

IndexDBClient.prototype.getDataAsArrayBuffer = function() {
    if (!this.db) {
        console.error("IndexedDB is not initialized");
        return;
    }

    var transaction = this.db.transaction(["videos"], "readonly");
    var store = transaction.objectStore("videos");
    var record = store.get(this.filename);

    if (!record) {
        console.error("Record not found");
        return;
    }

    return record.content;
};

IndexDBClient.prototype.reset = function() {
    if (!this.db) {
        console.error("IndexedDB is not initialized");
        return;
    }

    var transaction = this.db.transaction(["videos"], "readwrite");
    var store = transaction.objectStore("videos");

    var deleteRequest = store.delete(this.filename);

    deleteRequest.onsuccess = function(event) {
        console.log("Record deleted successfully");
    };

    deleteRequest.onerror = function(event) {
        console.error("Error deleting record:", event.target.error);
    };
};
