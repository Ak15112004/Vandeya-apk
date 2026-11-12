# VANDEYA Security Specification

## 1. Data Invariants
1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created or modified if `request.auth.uid == userId`. Role escalation to 'admin' cannot be performed by regular users.
2. **Post Ownership Invariant**: A post at `/posts/{postId}` must have `authorId == request.auth.uid`. Posts can only be deleted or updated by their respective author or an admin.
3. **Comment Integrity Invariant**: A comment at `/posts/{postId}/comments/{commentId}` must have `authorId == request.auth.uid` and reference a valid `postId`.
4. **Like Uniqueness & Non-Spoofing**: A like at `/likes/{likeId}` must have `userId == request.auth.uid`.
5. **Follow Symmetry**: A follow record at `/follows/{followId}` must have `followerId == request.auth.uid`.
6. **Chat Isolation**: Conversations at `/conversations/{conversationId}` can only be read or written to by users who are in `participants`.
7. **Message Authenticity**: A message within `/conversations/{conversationId}/messages/{messageId}` must have `senderId == request.auth.uid` and the sender must be an authorized conversation participant.
8. **Time Capsule Confidentiality**: A time capsule at `/timeCapsules/{capsuleId}` belongs strictly to `userId == request.auth.uid`.
9. **Admin Security Gate**: Only users present in `/admins/{adminId}` or with verified admin credentials can access admin moderation collections. User email `ay2608020@gmail.com` is bootstrapped as platform admin.
10. **Payload Bounds**: All string inputs are bounded by strict maximum lengths to prevent Denial-of-Wallet attacks.

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)
1. **Fake User Creation**: Attempting to create `/users/victim_user_1` while authenticated as `attacker_user_2`.
2. **Privilege Escalation**: Attempting to update `/users/attacker` setting `role: "admin"` or `isVerified: true`.
3. **Spoofed Post Author**: Submitting a post with `authorId: "modi_official"` from an unauthorized account.
4. **Unauthorized Post Deletion**: Deleting another user's post without admin privileges.
5. **Comment Spoofing**: Posting a comment where `authorId` does not match `request.auth.uid`.
6. **Like Hijacking**: Creating a like with `userId: "another_user"`.
7. **Eavesdropping on Private Chat**: Attempting to read `/conversations/{convId}` where the current user is not in `participants`.
8. **Impersonated Message Injection**: Injecting a message into a chat with another user's `senderId`.
9. **Time Capsule Snooping**: Attempting to query or read another user's locked time capsule.
10. **Payload Flooding**: Sending a post with `content` exceeding 2000 characters or 1MB payload.
11. **Malicious ID Injection**: Attempting to write with an invalid path variable containing slashes or dangerous characters.
12. **Admin Gateway Bypass**: Attempting to write to `/admins/{id}` as a non-admin user.
