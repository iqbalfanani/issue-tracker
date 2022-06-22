const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
require("../db-connection");

chai.use(chaiHttp);

// Create an issue with every field: POST request to /api/issues/{project}
// Create an issue with only required fields: POST request to /api/issues/{project}
// Create an issue with missing required fields: POST request to /api/issues/{project}
// View issues on a project: GET request to /api/issues/{project}
// View issues on a project with one filter: GET request to /api/issues/{project}
// View issues on a project with multiple filters: GET request to /api/issues/{project}
// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}

let deleteID;
suite("Functional Tests", function () {
  suite("Routing Tests", function () {
    suite("3 Post request Tests", function () {
      test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .post("/api/issues/projects")
          .set("content-type", "application/json")
          .send({
            issue_title: "Issue",
            issue_text: "Functional Test",
            created_by: "fCC",
            assigned_to: "Dom",
            status_text: "Not Done",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            deleteID = res.body._id;
            assert.equal(res.body.issue_title, "Issue");
            assert.equal(res.body.assigned_to, "Dom");
            assert.equal(res.body.created_by, "fCC");
            assert.equal(res.body.status_text, "Not Done");
            assert.equal(res.body.issue_text, "Functional Test");
            done();
          });
      });
      test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .post("/api/issues/projects")
          .set("content-type", "application/json")
          .send({
            issue_title: "Issue",
            issue_text: "Functional Test",
            created_by: "fCC",
            assigned_to: "",
            status_text: "",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "Issue");
            assert.equal(res.body.created_by, "fCC");
            assert.equal(res.body.issue_text, "Functional Test");
            assert.equal(res.body.assigned_to, "");
            assert.equal(res.body.status_text, "");
            done();
          });
      });
      test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .post("/api/issues/projects")
          .set("content-type", "application/json")
          .send({
            issue_title: "",
            issue_text: "",
            created_by: "fCC",
            assigned_to: "",
            status_text: "",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "required field(s) missing");
            done();
          });
      });
    });

    //////////////// GET REQUEST TESTS /////////////////////

    suite("3 Get request Tests", function () {
      test("View issues on a project: GET request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .get("/api/issues/test-data")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 4);
            done();
          });
      });
      test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .get("/api/issues/test-data")
          .query({
            _id: "62b1dce5bec9cb514c271770",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0], {
                "issue_title": "get",
                "issue_text": "test",
                "created_on": "2022-06-21T14:59:49.944Z",
                "updated_on": "2022-06-21T14:59:49.944Z",
                "created_by": "me",
                "assigned_to": "",
                "open": true,
                "status_text": "",
                "_id": "62b1dce5bec9cb514c271770"
                });
            done();
          });
      });
      test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .get("/api/issues/test-data")
          .query({
            issue_title: "Hey",
            issue_text: "asjd",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0], {
                "issue_title": "Hey",
                "issue_text": "asjd",
                "created_on": "2022-06-21T15:00:32.692Z",
                "updated_on": "2022-06-21T15:00:32.692Z",
                "created_by": "poqw",
                "assigned_to": "",
                "open": true,
                "status_text": "",
                "_id": "62b1dd10bec9cb514c271780"
                });

            done();
          });
      });
    });

    //////////////// PUT REQUEST TESTS /////////////////////

    suite("5 Put request Tests", function () {
      test("Update one field on an issue: PUT request to /api/issues/test-data-put", function (done) {
        chai
          .request(server)
          .put("/api/issues/test-data-put")
          .send({
            _id: "62b1e3ca964400d87de27172",
            issue_title: "different",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "62b1e3ca964400d87de27172");

            done();
          });
      });
      test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .put("/api/issues/test-data-put")
          .send({
            _id: "62b1e3ca964400d87de27172",
            issue_title: "random",
            issue_text: "random",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "62b1e3ca964400d87de27172");

            done();
          });
      });
      test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .put("/api/issues/test-data-put")
          .send({
            issue_title: "update",
            issue_text: "update",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");

            done();
          });
      });
      test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .put("/api/issues/test-data-put")
          .send({
            _id: "62b1e3ca964400d87de27172",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "no update field(s) sent");

            done();
          });
      });
      test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .put("/api/issues/test-data-put")
          .send({
            _id: "5fe0c500ec2f6f4c1815a770",
            issue_title: "update",
            issue_text: "update",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not update");

            done();
          });
      });
    });

    //////////////// DELETE REQUEST TESTS /////////////////////

    suite("3 DELETE request Tests", function () {
      test("Delete an issue: DELETE request to /api/issues/projects", function (done) {
        chai
          .request(server)
          .delete("/api/issues/projects")
          .send({
            _id: deleteID,
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully deleted");

            done();
          });
      });
      test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .delete("/api/issues/projects")
          .send({
            _id: "62b1e6811291a926c1895997invalid",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not delete");

            done();
          });
      });
      test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .delete("/api/issues/projects")
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");

            done();
          });
      });
    });
  });
});