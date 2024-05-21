import { gql } from '../../__generated__';

export const GENERATE_USER_PROFILE_PICTURE_URL = gql(/* GraphQL */ `
  mutation GenerateUserProfilePictureURL($filename: String!) {
    generateUserProfilePictureURL(filename: $filename)
  }
`);
