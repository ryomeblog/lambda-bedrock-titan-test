import { handler } from './index.js';
import assert from 'assert';

async function testHandler() {
    const event = {
        prompt: "AWS Lambdaとは何ですか？"
    };

    try {
        const response = await handler(event);
        const responseBody = JSON.parse(response.body);

        console.log('Response:', response);

        // テストケース: ステータスコードが200であることを確認
        assert.strictEqual(response.statusCode, 200, 'Expected status code to be 200');

        // テストケース: レスポンスにテキストが含まれていることを確認
        assert.ok(responseBody.text, 'Expected response to contain text');

        console.log('All tests passed!');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testHandler();
