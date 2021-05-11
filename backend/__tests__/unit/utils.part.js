const {formatResponse} = require('../../src/utils/format.response')

describe("Format Currency data from api",()=>{
    it("should format the response for good response", async () => {
        const response = formatResponse(true,'msg teste')
        expect(response.success).toBe(true);
    });

    it("should format the response for bad response", async () => {
        const response = formatResponse(false,'msg teste')
        expect(response.success).toBe(false);
    });
})