import {User} from '../../model/User';

export interface UsersPaginationResponse {
  content: User[],
  pageable: {
    sort: {
      'sorted': boolean,
      'unsorted': boolean,
      'empty': boolean
    },
    'offset': number,
    'pageNumber': number,
    'pageSize': number,
    'paged': boolean,
    'unpaged': boolean
  },
  'totalElements': number,
  'last': boolean,
  'totalPages': number,
  'number': number,
  'size': number,
  'sort': {
    'sorted': boolean,
    'unsorted': boolean,
    'empty': boolean
  },
  'numberOfElements': number,
  'first': boolean,
  'empty': boolean
}
