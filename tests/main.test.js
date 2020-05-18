/**
 * @jest-environment node
 */
jest.useFakeTimers();
const server = require("../server");
describe("server", () => {
	it("should run without any errors", () => {
		server().then(errors => {
			expect(errors).toBe(null);
		});
	});
});
