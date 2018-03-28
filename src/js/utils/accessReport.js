import config from 'conf';
import 'axios';
import qs from 'qs';
import { suitable, ua } from './deviceSuitability';

const payload = {
  rawUserAgent: navigator.userAgent,
  userAgent: ua,
  suitable: suitable
};

axios.post( config.accessReportURL, qs.stringify( payload ) );
