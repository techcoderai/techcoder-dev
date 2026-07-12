import { Tweet as ReactTweet } from "react-tweet";

/**
 * Embeds a tweet / X post by its numeric ID. Server-rendered via `react-tweet`
 * (no client-side Twitter widget script needed), so it works with static export.
 *
 * MDX usage:
 *   <Tweet id="1799212345678901234" />
 *
 * The ID is the number at the end of a tweet URL:
 *   https://x.com/vercel/status/1799212345678901234  ->  1799212345678901234
 */
export default function Tweet({ id }: { id: string }) {
  return (
    <div className="my-6 flex justify-center [&_.react-tweet-theme]:my-0">
      <ReactTweet id={id} />
    </div>
  );
}
