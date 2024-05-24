import { getInitials } from './name';

describe('getInitials', () => {
  it('should return N/A if name1 and name2 are not provided', () => {
    expect(getInitials()).toEqual('N/A');
  });

  it('should return the first 2 letter of name1 if name2 is not provided', () => {
    expect(getInitials('John')).toEqual('JO');
  });

  it('should return the first letter of each name if name1 and name2 are provided', () => {
    expect(getInitials('John', 'Doe')).toEqual('JD');
  });
});
