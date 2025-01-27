import { connect } from 'react-redux';
import { compose } from 'redux';
import { uploadFile } from 'app/actions/FileActions';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { addCompany } from '../../actions/CompanyActions';
import CompanyEditor from './components/CompanyEditor';

const mapStateToProps = (state, props) => {
  return {
    initialValues: {
      name: '',
      description: '',
      adminComment: '',
      website: '',
      studentContact: '',
      active: 'true',
      phone: '',
      companyType: '',
      paymentMail: '',
      address: '',
    },
  };
};

const mapDispatchToProps = {
  submitFunction: addCompany,
  uploadFile,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(CompanyEditor);
