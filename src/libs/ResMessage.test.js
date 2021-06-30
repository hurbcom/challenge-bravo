import ResMessage from './ResMessage';
import utils from './Utils';

jest.mock('./Utils');

global.utils = utils;

describe('#_createMessage', () => {
    test('it throws an error when the message code is unknown', () => {
        const messageCode = 'tralala';
        
        try {
            ResMessage._createMessage(messageCode);
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });

    test("it returns { message: 'Success', status: 200, data: {} } when passed the code = 'success'", () => {
        const messageCode = 'success';
        const _isSuccessCodeMock = jest.spyOn(ResMessage, '_isSuccessCode');
        
        _isSuccessCodeMock.mockImplementation(() => true);
        utils.newObject.mockImplementation((obj1, obj2) => ({ ...obj1, ...obj2 }));
        
        try {
            const result = ResMessage._createMessage(messageCode);

            expect(result).toBeTruthy();
            expect(result).toHaveProperty('message', 'Success');
            expect(result).toHaveProperty('status', 200);
            expect(result).toHaveProperty('data', {});
        } catch (err) {
            expect(err).toBeFalsy();
        }

        _isSuccessCodeMock.mockRestore();
    });

    test("it returns { message: 'custom message', status: 200, data: {} } when passed the code = 'success' and customData = { message: 'custom message' }", () => {
        const messageCode = 'success';
        const customData = {
            message: 'custom message'
        };
        const _isSuccessCodeMock = jest.spyOn(ResMessage, '_isSuccessCode');
        
        _isSuccessCodeMock.mockImplementation(() => true);
        utils.newObject.mockImplementation((obj1, obj2) => ({ ...obj1, ...obj2 }));
        
        try {
            const result = ResMessage._createMessage(messageCode, customData);

            expect(result).toBeTruthy();
            expect(result).toHaveProperty('message', customData.message);
            expect(result).toHaveProperty('status', 200);
            expect(result).toHaveProperty('data', {});
        } catch (err) {
            expect(err).toBeFalsy();
        }

        _isSuccessCodeMock.mockRestore();
    });

    test("it returns { message: 'Success', status: 200, data: { id: 1 } } when passed the code = 'success' and customData = { data: { id: 1 } }", () => {
        const messageCode = 'success';
        const customData = {
            data: { id: 1 }
        };
        const _isSuccessCodeMock = jest.spyOn(ResMessage, '_isSuccessCode');
        
        _isSuccessCodeMock.mockImplementation(() => true);
        utils.newObject.mockImplementation((obj1, obj2) => ({ ...obj1, ...obj2 }));
        
        try {
            const result = ResMessage._createMessage(messageCode, customData);

            expect(result).toBeTruthy();
            expect(result).toHaveProperty('message', 'Success');
            expect(result).toHaveProperty('status', 200);
            expect(result).toHaveProperty('data', customData.data);
        } catch (err) {
            expect(err).toBeFalsy();
        }

        _isSuccessCodeMock.mockRestore();
    });

    test("it returns { message: 'Success', status: 200, data: {} } when passed the code = 'success' and customData = { error: { id: 1 } }", () => {
        const messageCode = 'success';
        const customData = {
            error: { id: 1 }
        };
        const _isSuccessCodeMock = jest.spyOn(ResMessage, '_isSuccessCode');
        
        _isSuccessCodeMock.mockImplementation(() => true);
        utils.newObject.mockImplementation((obj1, obj2) => ({ ...obj1, ...obj2 }));
        
        try {
            const result = ResMessage._createMessage(messageCode, customData);

            expect(result).toBeTruthy();
            expect(result).toHaveProperty('message', 'Success');
            expect(result).toHaveProperty('status', 200);
            expect(result).toHaveProperty('data', {});
        } catch (err) {
            expect(err).toBeFalsy();
        }

        _isSuccessCodeMock.mockRestore();
    });
    
    test("it returns { message: 'Internal server error', status: 500, error: {} } when passed the code = 'error'", () => {
        const messageCode = 'error';
        const _isSuccessCodeMock = jest.spyOn(ResMessage, '_isSuccessCode');
        const _isErrorCodeMock = jest.spyOn(ResMessage, '_isErrorCode');
        
        _isSuccessCodeMock.mockImplementation(() => false);
        _isErrorCodeMock.mockImplementation(() => true);
        utils.newObject.mockImplementation((obj1, obj2) => ({ ...obj1, ...obj2 }));
        
        try {
            const result = ResMessage._createMessage(messageCode);

            expect(result).toBeTruthy();
            expect(result).toHaveProperty('message', 'Internal server error');
            expect(result).toHaveProperty('status', 500);
            expect(result).toHaveProperty('error', {});
        } catch (err) {
            expect(err).toBeFalsy();
        }

        _isSuccessCodeMock.mockRestore();
        _isErrorCodeMock.mockRestore();
    });

    test("it returns { message: 'custom message', status: 500, error: {} } when passed the code = 'error' and customData = { message: 'custom message' }", () => {
        const messageCode = 'error';
        const customData = {
            message: 'custom message'
        };
        const _isSuccessCodeMock = jest.spyOn(ResMessage, '_isSuccessCode');
        const _isErrorCodeMock = jest.spyOn(ResMessage, '_isErrorCode');
        
        _isSuccessCodeMock.mockImplementation(() => false);
        _isErrorCodeMock.mockImplementation(() => true);
        utils.newObject.mockImplementation((obj1, obj2) => ({ ...obj1, ...obj2 }));
        
        try {
            const result = ResMessage._createMessage(messageCode, customData);

            expect(result).toBeTruthy();
            expect(result).toHaveProperty('message', customData.message);
            expect(result).toHaveProperty('status', 500);
            expect(result).toHaveProperty('error', {});
        } catch (err) {
            expect(err).toBeFalsy();
        }

        _isSuccessCodeMock.mockRestore();
        _isErrorCodeMock.mockRestore();
    });

    test("it returns { message: 'Internal server error', status: 500, error: { id: 1 } } when passed the code = 'error' and customData = { error: { id: 1 } }", () => {
        const messageCode = 'error';
        const customData = {
            error: { id: 1 }
        };
        const _isSuccessCodeMock = jest.spyOn(ResMessage, '_isSuccessCode');
        const _isErrorCodeMock = jest.spyOn(ResMessage, '_isErrorCode');
        
        _isSuccessCodeMock.mockImplementation(() => false);
        _isErrorCodeMock.mockImplementation(() => true);
        utils.newObject.mockImplementation((obj1, obj2) => ({ ...obj1, ...obj2 }));
        
        try {
            const result = ResMessage._createMessage(messageCode, customData);

            expect(result).toBeTruthy();
            expect(result).toHaveProperty('message', 'Internal server error');
            expect(result).toHaveProperty('status', 500);
            expect(result).toHaveProperty('error', customData.error);
        } catch (err) {
            expect(err).toBeFalsy();
        }

        _isSuccessCodeMock.mockRestore();
        _isErrorCodeMock.mockRestore();
    });

    test("it returns { message: 'Internal server error', status: 500, error: {} } when passed the code = 'error' and customData = { data: { id: 1 } }", () => {
        const messageCode = 'error';
        const customData = {
            data: { id: 1 }
        };
        const _isSuccessCodeMock = jest.spyOn(ResMessage, '_isSuccessCode');
        const _isErrorCodeMock = jest.spyOn(ResMessage, '_isErrorCode');
        
        _isSuccessCodeMock.mockImplementation(() => false);
        _isErrorCodeMock.mockImplementation(() => true);
        utils.newObject.mockImplementation((obj1, obj2) => ({ ...obj1, ...obj2 }));
        
        try {
            const result = ResMessage._createMessage(messageCode, customData);

            expect(result).toBeTruthy();
            expect(result).toHaveProperty('message', 'Internal server error');
            expect(result).toHaveProperty('status', 500);
            expect(result).toHaveProperty('error', {});
        } catch (err) {
            expect(err).toBeFalsy();
        }

        _isSuccessCodeMock.mockRestore();
        _isErrorCodeMock.mockRestore();
    });
});