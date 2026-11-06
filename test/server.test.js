
const { test } = require("node:test");
const assert = require("node:assert/strict");

const BASE_URL = "http://localhost:3000";

test("TrustVault backend is running", async () => {
    const response = await fetch(`${BASE_URL}/api/status`);

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.equal(data.success, true);
    assert.equal(data.message, "TrustVault backend is running!");
});

test("Documents API requires login", async () => {
    const response = await fetch(`${BASE_URL}/api/documents`);

    assert.equal(response.status, 401);

    const data = await response.json();

    assert.equal(data.success, false);
    assert.equal(data.message, "Please log in first.");
});

test("Shared documents API requires login", async () => {
    const response = await fetch(`${BASE_URL}/api/shared-documents`);

    assert.equal(response.status, 401);

    const data = await response.json();

    assert.equal(data.success, false);
    assert.equal(data.message, "Please log in first.");
});

test("Activities API requires login", async () => {
    const response = await fetch(`${BASE_URL}/api/activities`);

    assert.equal(response.status, 401);

    const data = await response.json();

    assert.equal(data.success, false);
    assert.equal(data.message, "Please log in first.");
});
