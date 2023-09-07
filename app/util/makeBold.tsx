import { Fragment } from "react";
import reactStringReplace from "react-string-replace";

type Change = {
  regex: RegExp;
  fn: (match: string, index: number, offset: number) => React.ReactNode;
};
function makeProcessor(...changes: Change[]) {
  return function process(
    input: string | ReturnType<typeof reactStringReplace>,
  ) {
    for (let change of changes) change.regex.lastIndex = 0;

    return Array.from(
      changes.reduce(
        (input, change) => reactStringReplace(input, change.regex, change.fn),
        input,
      ),
    ).map((match, i) => <Fragment key={i}>{match}</Fragment>);
  };
}
export const makeBold = makeProcessor({
  regex: /\*(.*?)\*/g,
  fn(match, i) {
    return (
      <span
        key={match + i}
        className="rounded bg-yellow-500 bg-opacity-20 px-0.5 text-yellow-500"
      >
        {match.replace(/\*(.*?)\*/g, "$1")}
      </span>
    );
  },
});
