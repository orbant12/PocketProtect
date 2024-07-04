import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import TabOneScreen from '../pages/Home/home';
import { useAuth } from '../context/UserAuthContext';
import { fetchMonthTasks, fetchReminders, fetchOutDatedSpots, fetchRiskySpots, fetchUnfinishedSpots, fetchUserData } from '../services/server';

 