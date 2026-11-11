import { Controller, Get, Redirect } from '@nestjs/common';

/**
 * Health check and landing page redirect controller.
 */
@Controller()
export class HealthController {
  /**
   * Health endpoint for container orchestrators and keep-alive pings (e.g. Render, Railway).
   */
  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Redirects root URL requests straight to Apollo Sandbox at /graphql.
   */
  @Get()
  @Redirect('/graphql', 302)
  redirectToGraphQL(): void {
    // Redirection handled by @Redirect decorator
  }
}
