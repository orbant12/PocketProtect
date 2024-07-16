import fetch from 'cross-fetch';
import { fetchUserData } from '../../services/server'; // Adjust the import to your file structure

jest.mock('cross-fetch', () => jest.fn());

describe('fetchUserData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return user data if the request is successful', async () => {
        const mockResponse = { id: '123', name: 'John Doe' };
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await fetchUserData({ userId: '123' });
        expect(result).toEqual(mockResponse);
    });

    it('should return null if the request fails', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
        });

        const result = await fetchUserData({ userId: '123' });
        expect(result).toBeNull();
    });

    it('should return null if an exception occurs', async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

        const result = await fetchUserData({ userId: '123' });
        expect(result).toBeNull();
    });
});
