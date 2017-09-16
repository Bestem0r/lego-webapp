// @flow

import { Company, Event } from './ActionTypes';
import callAPI from 'app/actions/callAPI';
import {
  companySchema,
  eventSchema,
  companySemesterSchema
} from 'app/reducers';
import { startSubmit, stopSubmit } from 'redux-form';
import { push } from 'react-router-redux';
import type { Thunk } from 'app/types';

export function fetchAll() {
  return callAPI({
    types: Company.FETCH,
    endpoint: '/companies/',
    schema: [companySchema],
    meta: {
      errorMessage: 'Fetching companies failed'
    },
    propagateError: true
  });
}

export function fetch(companyId: number): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Company.FETCH,
        endpoint: `/companies/${companyId}/`,
        schema: companySchema,
        meta: {
          errorMessage: 'Fetching single company failed'
        },
        propagateError: true
      })
    ).then(() =>
      dispatch(
        callAPI({
          types: Event.FETCH,
          endpoint: `/events/?company=${companyId}`,
          schema: [eventSchema],
          meta: {
            errorMessage: 'Fetching assosiated events failed'
          }
        })
      )
    );
}

export function addCompany(data: Object): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('company'));

    return dispatch(
      callAPI({
        types: Company.ADD,
        endpoint: '/companies/',
        method: 'post',
        body: data,
        schema: companySchema,
        meta: {
          errorMessage: 'Adding company failed'
        }
      })
    )
      .then(action => {
        const id = action.payload.result;
        dispatch(stopSubmit('company'));
        dispatch(push(`/bdb/${id}`));
      })
      .catch();
  };
}

export function editCompany({ companyId, ...data }: Object): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('company'));

    return dispatch(
      callAPI({
        types: Company.EDIT,
        endpoint: `/companies/${companyId}/`,
        method: 'PATCH',
        body: data,
        schema: companySchema,
        meta: {
          errorMessage: 'Editing company failed'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}

export function deleteCompany(companyId: number): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('company'));

    return dispatch(
      callAPI({
        types: Company.DELETE,
        endpoint: `/companies/${companyId}/`,
        method: 'delete',
        meta: {
          companyId,
          errorMessage: 'Deleting company failed'
        },
        schema: companySchema
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push('/bdb/'));
    });
  };
}

export function addSemesterStatus(
  { companyId, ...data }: Object,
  // TODO: change this to take in an object,
  // addSemesterStatus(something, false) really doesn't say much
  detail: boolean = false
): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('company'));

    return dispatch(
      callAPI({
        types: Company.ADD_SEMESTER_STATUS,
        endpoint: `/companies/${companyId}/semester-statuses/`,
        method: 'post',
        body: data,
        meta: {
          errorMessage: 'Adding semester status failed'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      if (detail) {
        dispatch(push(`/bdb/${companyId}/`));
      } else {
        dispatch(push('/bdb/'));
      }
    });
  };
}

export function editSemesterStatus(
<<<<<<< HEAD
  { companyId, semesterId, contactedStatus, contract }: Object,
  // TODO: change this to take in an object,
  // editSemesterStatus(something, false) really doesn't say much
  detail: boolean = false
): Thunk<*> {
=======
  { companyId, semesterStatusId, contactedStatus, contract },
  detail = false
) {
>>>>>>> Select most prominent status when deciding which color each semesterstatus should be
  return dispatch => {
    dispatch(startSubmit('company'));

    return dispatch(
      callAPI({
        types: Company.EDIT_SEMESTER_STATUS,
        endpoint: `/companies/${companyId}/semester-statuses/${semesterStatusId}/`,
        method: 'PATCH',
        body: {
          contactedStatus,
          contract
        },
        meta: {
          errorMessage: 'Editing semester status failed'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      if (detail) {
        dispatch(push(`/bdb/${companyId}/`));
      } else {
        dispatch(push('/bdb/'));
      }
    });
  };
}

export function deleteSemesterStatus(
  companyId: number,
  semesterId: number
): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('company'));

    return dispatch(
      callAPI({
        types: Company.DELETE_SEMESTER_STATUS,
        endpoint: `/companies/${companyId}/semester-statuses/${semesterId}/`,
        method: 'delete',
        meta: {
          companyId,
          semesterId,
          errorMessage: 'Deleting semester status failed'
        },
        schema: companySchema
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}

export function fetchCompanyContact({ companyId }: { companyId: number }) {
  return callAPI({
    types: Company.FETCH_COMPANY_CONTACT,
    endpoint: `/companies/${companyId}/company-contacts/`,
    method: 'GET',
    meta: {
      errorMessage: 'Fetching company contact failed'
    }
  });
}

export function addCompanyContact({
  companyId,
  name,
  role,
  mail,
  phone
}: Object): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('company'));

    return dispatch(
      callAPI({
        types: Company.ADD_COMPANY_CONTACT,
        endpoint: `/companies/${companyId}/company-contacts/`,
        method: 'post',
        body: {
          name,
          role,
          mail,
          phone
        },
        meta: {
          errorMessage: 'Adding company contact failed'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}

export function editCompanyContact({
  companyId,
  companyContactId,
  name,
  role,
  mail,
  phone
}: Object): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('company'));

    return dispatch(
      callAPI({
        types: Company.EDIT_COMPANY_CONTACT,
        endpoint: `/companies/${companyId}/company-contacts/${companyContactId}/`,
        method: 'PATCH',
        body: {
          name,
          role,
          mail,
          phone
        },
        meta: {
          errorMessage: 'Editing company contact failed'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push(`bdb/${companyId}`));
    });
  };
}

export function deleteCompanyContact(
  companyId: number,
  companyContactId: number
): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('company'));

    return dispatch(
      callAPI({
        types: Company.DELETE_COMPANY_CONTACT,
        endpoint: `/companies/${companyId}/company-contacts/${companyContactId}/`,
        method: 'delete',
        meta: {
          companyId,
          companyContactId,
          errorMessage: 'Deleting company contact failed'
        },
        schema: companySchema
      })
    ).then(() => {
      dispatch(stopSubmit('company'));
      dispatch(push(`/bdb/${companyId}/`));
    });
  };
}

export function fetchSemesters() {
  return callAPI({
    types: Company.FETCH_SEMESTERS,
    endpoint: '/company-semesters/',
    schema: [companySemesterSchema],
    meta: {
      errorMessage: 'Fetching company semesters failed'
    },
    propagateError: true
  });
}

export function addSemester(year, semester) {
  return dispatch => {
    dispatch(startSubmit('companySemester'));

    return dispatch(
      callAPI({
        types: Company.ADD_SEMESTER,
        endpoint: `/company-semesters/`,
        method: 'post',
        body: {
          year,
          semester
        },
        meta: {
          errorMessage: 'Adding semester failed'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('companySemester'));
    });
  };
}
