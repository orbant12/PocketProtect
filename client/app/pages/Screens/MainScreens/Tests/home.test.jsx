// TabOneScreen.test.js

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TabOneScreen from '../home';
import { useAuth } from '../../../../context/UserAuthContext';
import { fetchMonthTasks, fetchReminders } from '../../../../server';

// Mock dependencies
jest.mock('../../../../context/UserAuthContext');
jest.mock('../../../../server');
jest.mock('react-native-pager-view', () => 'PagerView');

// Mock functions
const mockNavigate = jest.fn();

const navigation = { navigate: mockNavigate };

// Mock current user
const mockCurrentUser = { uid: '12345' };

useAuth.mockReturnValue({ currentuser: mockCurrentUser });

describe('TabOneScreen', () => {
    beforeEach(() => {
        fetchMonthTasks.mockResolvedValue([]);
        fetchReminders.mockResolvedValue([]);
    });

    test('renders correctly', () => {
        const { getByText } = render(<TabOneScreen navigation={navigation} />);
        
        expect(getByText("Today's Tasks")).toBeTruthy();
        expect(getByText("Daily Health Report")).toBeTruthy();
    });

    test('fetches data on mount', async () => {
        fetchMonthTasks.mockResolvedValue([{ date: '2023-06-01' }]);
        fetchReminders.mockResolvedValue([{ id: 'blood_work', expires: '2023-06-30' }]);

        const { getByText } = render(<TabOneScreen navigation={navigation} />);

        await waitFor(() => {
            expect(fetchMonthTasks).toHaveBeenCalledWith({ userId: mockCurrentUser.uid, month: 6, year: 2024 });
            expect(fetchReminders).toHaveBeenCalledWith({ userId: mockCurrentUser.uid });
        });
        
    });

    test('navigates on button press', () => {
        const { getByText } = render(<TabOneScreen navigation={navigation} />);

        fireEvent.press(getByText('Start Now'));

        expect(mockNavigate).toHaveBeenCalledWith('DailyReport', { type: 'first' });
    });

    test('handles date selection', () => {
        const { getByText, getByTestId } = render(<TabOneScreen navigation={navigation} />);

        fireEvent.press(getByTestId('date-2023-06-02'));

        expect(getByText('2023-06-02 Tasks')).toBeTruthy();
    });

    test('refreshes data on pull-to-refresh', async () => {
        const { getByText, getByTestId } = render(<TabOneScreen navigation={navigation} />);

        fetchMonthTasks.mockResolvedValue([{ date: '2023-06-01' }]);
        fetchReminders.mockResolvedValue([{ id: 'blood_work', expires: '2023-06-30' }]);

        fireEvent(getByTestId('scroll-view'), 'refresh');

        await waitFor(() => {
            expect(fetchMonthTasks).toHaveBeenCalledTimes(2);
            expect(fetchReminders).toHaveBeenCalledTimes(2);
        });
    });
});
