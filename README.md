# September 2023 Remix Meetup

<table>
  <tr>
    <td>
      <img src="https://github.com/Synvox/remix-chat-sse/blob/main/assets/mobile-3.png?raw=true" alt="Mobile Screenshot">
    </td>
    <td>
      <img src="https://github.com/Synvox/remix-chat-sse/blob/main/assets/mobile-1.png?raw=true" alt="Mobile Screenshot">
    </td>
    <td>
      <img src="https://github.com/Synvox/remix-chat-sse/blob/main/assets/mobile-2.png?raw=true" alt="Mobile Screenshot">
    </td>
  </tr>
</table>

## Demo Points

1. Routes

- Show the 4 `_app` routes
- Show the pathless route
- Show how `<Outlet/>` works
- Show how `<Link/>` works with relative paths

2. Forms

- Show the message form with and without JavaScript enabled
- Show the new thread form with and without JavaScript enabled
- Show how buttons can have names and values
- Show how useFetcher works with forms vs `<Form>`

3. Actions

- Show how you can use CTEs to update multiple tables without a transaction
- Show how you can create getters that look at `DataFunctionArgs`

4. useState and useEffect

- Show that a relatively complex app doesn't need much client side state

5. Live updates using EventSource

- Show how resource routes can be used to create a live feed
- Show how you can use revalidator to validate data on the client

6. Mobile friendly

- Show how the app works on mobile
- Show how you can use scroll snapping to create panels and named anchors to navigate to them
  - Show how this also helps with accessibility

7. shouldRevalidate

- Show how you can force a layout route to revalidate if you're doing something weird for a good reason (like updating a read record)

8. FTS Search

- Show how you can use FTS to search for messages with highlighting

9. Sticky list headers

- Show how you can use `position: sticky` to create sticky list headers
- Show how you can group items to make the list header push away when scrolling

10. Theming

- Show how you can use CSS variables to theme an app
- Show how the new rgb function can be used with css variables to create shades

11. ClassNames and Variants

- Show how you can build a component library with ClassNames and Variants
