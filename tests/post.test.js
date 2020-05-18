const Post = require('../models/Post');
const User = require('../models/User');
let results = Post.create({
	title: "test 1",
	body: "hello world",
	UserId: 4
}).then(result => {
	console.log(result);
	return result;
});

describe("Post", () => {
	describe("DB create", () => {
		it("should create a post with the specified details", () => {
			expect(results.title).toEqual("test 1");
			expect(results.body).toEqual("hello world");
			expect(results.UserId).toEqual(1);
		});
	});
});