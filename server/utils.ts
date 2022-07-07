import { spawn } from "child_process";

export function execute(cmd: string) {
    const args = cmd.split(' ');
    return spawn(args[0], args.slice(1), {
        shell: true
    })
}