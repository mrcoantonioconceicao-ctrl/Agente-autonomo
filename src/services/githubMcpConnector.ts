import { Octokit } from "@octokit/rest";

export interface PullRequestErrorContext {
  owner: string;
  repo: string;
  pullNumber: number;
  branch: string;
  title: string;
  failedWorkflowLogs: string;
  changedFiles: string[];
}

/**
 * Conector MCP para GitHub (Service-Oriented Architecture / MCP Bus)
 * Permite varredura autônoma de PRs quebrados no CI/CD e commit direto de patches Rug.
 */
export class GitHubMcpConnector {
  private octokit: Octokit;

  constructor(personalAccessToken: string) {
    if (!personalAccessToken) {
      throw new Error("Erro Crítico: GitHub Personal Access Token (PAT) não fornecido.");
    }
    // Inicializa a API do GitHub com o token seguro
    this.octokit = new Octokit({ auth: personalAccessToken });
  }

  /**
   * Identifica Pull Requests com falha no CI/CD (ex: cargo test ou build quebrado)
   */
  async getFailedPullRequests(owner: string, repo: string): Promise<PullRequestErrorContext[]> {
    try {
      // 1. Busca PRs abertos
      const { data: pullRequests } = await this.octokit.pulls.list({
        owner,
        repo,
        state: "open",
      });

      const failedPRs: PullRequestErrorContext[] = [];

      for (const pr of pullRequests) {
        const ref = pr.head.sha;
        
        // 2. Verifica o status das Checks/Actions associadas ao commit do PR
        const { data: checkRuns } = await this.octokit.checks.listForRef({
          owner,
          repo,
          ref,
        });

        const hasFailedChecks = checkRuns.check_runs.some(
          (run) => run.conclusion === "failure" || run.conclusion === "timed_out" || run.conclusion === "action_required"
        );

        if (hasFailedChecks || checkRuns.check_runs.length === 0) {
          // 3. Puxa os arquivos modificados no PR para análise do GraphRAG
          const { data: files } = await this.octokit.pulls.listFiles({
            owner,
            repo,
            pull_number: pr.number,
          });

          failedPRs.push({
            owner,
            repo,
            pullNumber: pr.number,
            branch: pr.head.ref,
            title: pr.title || `PR #${pr.number}`,
            failedWorkflowLogs: `Workflow CI/CD falhou no commit ${ref.substring(0, 7)} (cargo test / anchor test error)`,
            changedFiles: files.map((f) => f.filename),
          });
        }
      }

      return failedPRs;
    } catch (error: any) {
      throw new Error(`Falha ao varrer PRs no GitHub: ${error.message}`);
    }
  }

  /**
   * Envia o patch de correção gerado pelo motor Rug de volta para o repositório
   */
  async pushCorrectionPatch(
    owner: string,
    repo: string,
    branchName: string,
    filePath: string,
    newContent: string,
    commitMessage: string
  ): Promise<{ success: boolean; commitUrl?: string }> {
    try {
      // 1. Obtém o SHA do arquivo atual para permitir o update
      const { data: fileData } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: branchName,
      });

      if (!Array.isArray(fileData) && "sha" in fileData) {
        // 2. Faz o commit do arquivo corrigido (Clean Code / Rug Patch)
        const response = await this.octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: filePath,
          message: commitMessage,
          content: Buffer.from(newContent).toString("base64"),
          sha: fileData.sha,
          branch: branchName,
        });

        return {
          success: true,
          commitUrl: response.data.commit.html_url,
        };
      } else {
        throw new Error(`Caminho '${filePath}' não é um arquivo individual ou não possui SHA.`);
      }
    } catch (error: any) {
      throw new Error(`Falha ao aplicar patch de correção no GitHub: ${error.message}`);
    }
  }
}
