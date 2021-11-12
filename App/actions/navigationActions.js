/*
 * Reducer actions related with navigation
 */
import NavigationService from 'App/navigation/NavigationService';

export function navigateToHome(params) {
    NavigationService.navigate('Home', params);
}

export function goBack(key) {
    NavigationService.goBack(key);
}
