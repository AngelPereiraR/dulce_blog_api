export const stripTags = (content) => {
  return content.replace(/(<([^>]+)>)/gi, "");
}
