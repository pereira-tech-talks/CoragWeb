import { describe, expect, it } from 'vitest';
import {
  buildOAuthAuthorizationServerMetadata,
  buildOAuthProtectedResourceMetadata,
  getRequestOrigin,
} from '../../../functions/_lib/oauth-metadata';

describe('oauth metadata helpers', () => {
  describe('getRequestOrigin', () => {
    it('strips path and query', () => {
      expect(
        getRequestOrigin(
          'https://corag.app/.well-known/oauth-protected-resource'
        )
      ).toBe('https://corag.app');
    });
  });

  describe('buildOAuthProtectedResourceMetadata', () => {
    it('matches request origin for apex and v3', () => {
      const apex = buildOAuthProtectedResourceMetadata('https://corag.app');
      expect(apex.resource).toBe('https://corag.app');
      expect(apex.authorization_servers).toEqual(['https://corag.app']);
      expect(apex.bearer_methods_supported).toContain('header');
      expect(apex.scopes_supported).toContain('public:read');

      const v3 = buildOAuthProtectedResourceMetadata('https://corag.app');
      expect(v3.resource).toBe('https://corag.app');
      expect(v3.authorization_servers).toEqual(['https://corag.app']);
    });
  });

  describe('buildOAuthAuthorizationServerMetadata', () => {
    it('includes top-level claim_uri for anonymous authMd scanners', () => {
      const origin = 'https://corag.app';
      const meta = buildOAuthAuthorizationServerMetadata(origin);
      expect(meta.issuer).toBe(origin);
      expect(meta.agent_auth.skill).toBe(`${origin}/auth.md`);
      expect(meta.agent_auth.register_uri).toBe(`${origin}/agent/register`);
      expect(meta.agent_auth.identity_endpoint).toBe(
        `${origin}/agent/register`
      );
      // isitagentready fails with "anonymous registration requires claim_uri"
      // unless claim_uri is present at the agent_auth root (not only nested).
      expect(meta.agent_auth.claim_uri).toBe(`${origin}/agent/claim`);
      expect(meta.agent_auth.claim_endpoint).toBe(`${origin}/agent/claim`);
      expect(meta.agent_auth.claim_complete_uri).toBe(
        `${origin}/agent/claim/complete`
      );
      expect(meta.agent_auth.identity_types_supported).toContain('anonymous');
      expect(meta.agent_auth.anonymous.credential_types_supported).toContain(
        'access_token'
      );
      expect(meta.agent_auth.anonymous.claim_uri).toBe(`${origin}/agent/claim`);
      expect(meta.agent_auth.revocation_uri).toBe(`${origin}/oauth/revoke`);
      expect(meta.bearer_methods_supported).toContain('header');
    });
  });
});
