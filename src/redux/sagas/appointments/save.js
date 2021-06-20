import {
  all, takeLatest, call, put,
} from 'redux-saga/effects';
import { global } from 'redux/reducers/global';
import { appointments } from 'redux/reducers/appointments';
import moment from 'moment';
import rsf from '../../rsf';

function* callSaveAppointment({ payload }) {
  const {
    blocked, endDate, startDate, description, patient, professional, practices,
  } = payload;
  console.log(endDate);
  try {
    yield put(global.showLoader());
    let parsedStartDate = startDate;
    let parsedEndDate = endDate;
    if (moment.isMoment(startDate)) {
      parsedStartDate = moment(startDate).toDate();
    }
    if (moment.isMoment(endDate)) {
      parsedEndDate = moment(endDate).toDate();
    }
    yield call(rsf.database.create, 'appointments', {
      blocked,
      startDate: parsedStartDate.toUTCString(),
      endDate: parsedEndDate.toUTCString(),
      description,
      patient,
      professional,
      practices,
    });
  } catch (error) {
    console.log(error);
  }
  yield put(global.hideLoader());
}

export default function* watchSaveAppointment() {
  yield all([takeLatest(appointments.save.type, callSaveAppointment)]);
}
