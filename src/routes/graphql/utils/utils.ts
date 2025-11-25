import { parseResolveInfo } from 'graphql-parse-resolve-info';
import type { GraphQLResolveInfo } from 'graphql';

export const fieldInQuery = (
  info: GraphQLResolveInfo,
  typeName: string,
  fieldName: string,
): boolean => {
  const parsed = parseResolveInfo(info);
  return Boolean(
    parsed &&
      typeof parsed === 'object' &&
      'fieldsByTypeName' in parsed &&
      parsed.fieldsByTypeName &&
      typeof parsed.fieldsByTypeName === 'object' &&
      typeName in parsed.fieldsByTypeName &&
      parsed.fieldsByTypeName[typeName] &&
      typeof parsed.fieldsByTypeName[typeName] === 'object' &&
      fieldName in parsed.fieldsByTypeName[typeName],
  );
};
