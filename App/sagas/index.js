/**
 *  Redux saga class init
 */
import { takeEvery, takeLatest } from 'redux-saga/effects';
import * as types from '../actions/types';
import * as searchSaga from './searchSaga';


export default function* watch() {

    yield takeLatest(types.FETCHING_DATA, searchSaga.searchingData);
    yield takeLatest(types.FETCHING_SUGGESTING_DATA, searchSaga.suggestingData);
    yield takeLatest(types.FETCHING_DATA_FILTER, searchSaga.filterActionChange);
    yield takeLatest(types.FETCHING_DATA_UPDATE_COORDINATE, searchSaga.updateCoordinateChange);
    yield takeLatest(types.FETCHING_DATA_INITIAL, searchSaga.initDefaultApplication);
    yield takeLatest(types.FETCHING_DATA_SELECTED, searchSaga.selectedIndexAction);
    yield takeLatest(types.FETCHING_DATA_SELECTEDID, searchSaga.selectedIdDealerAction);
    yield takeLatest(types.UPDATED_DATA_BOUNDING, searchSaga.updateDataBounding);


}
