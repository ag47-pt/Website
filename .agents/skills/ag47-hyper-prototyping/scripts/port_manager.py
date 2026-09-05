import os
import sys
import subprocess
import re

def get_pid_on_port_windows(port):
    try:
        # Executa netstat para encontrar a porta local e o PID associado
        output = subprocess.check_output("netstat -ano", shell=True).decode('utf-8', errors='ignore')
        lines = output.strip().split('\n')
        pids = set()
        for line in lines:
            if f":{port} " in line or f".0.0.0:{port} " in line or f"[::]:{port} " in line:
                parts = line.strip().split()
                if len(parts) >= 5:
                    pid = parts[-1]
                    if pid.isdigit() and pid != '0':
                        pids.add(int(pid))
        return list(pids)
    except Exception as e:
        print(f"Erro ao verificar porta no Windows: {e}")
        return []

def get_pid_on_port_unix(port):
    try:
        output = subprocess.check_output(f"lsof -t -i :{port}", shell=True).decode('utf-8').strip()
        if output:
            return [int(pid) for pid in output.split('\n') if pid.isdigit()]
    except Exception:
        pass
    try:
        output = subprocess.check_output(f"fuser {port}/tcp", shell=True).decode('utf-8').strip()
        pids = re.findall(r'\b\d+\b', output)
        return [int(pid) for pid in pids]
    except Exception:
        pass
    return []

def kill_process(pid):
    try:
        if os.name == 'nt':
            subprocess.check_call(f"taskkill /F /PID {pid}", shell=True)
        else:
            os.kill(pid, 9)
        return True
    except Exception as e:
        print(f"Falha ao derrubar o processo {pid}: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Uso: python port_manager.py <numero_da_porta>")
        sys.exit(1)
    
    try:
        port = int(sys.argv[1])
    except ValueError:
        print("Erro: A porta deve ser um numero inteiro.")
        sys.exit(1)
        
    print(f"Procurando processos utilizando a porta {port}...")
    pids = get_pid_on_port_windows(port) if os.name == 'nt' else get_pid_on_port_unix(port)
    
    if not pids:
        print(f"Nenhum processo ativo encontrado ocupando a porta {port}.")
        sys.exit(0)
        
    print(f"Processos encontrados na porta {port}: {pids}")
    success_count = 0
    for pid in pids:
        print(f"Derrubando o processo PID {pid}...")
        if kill_process(pid):
            print(f"Processo {pid} encerrado com sucesso.")
            success_count += 1
            
    if success_count > 0:
        print(f"A porta {port} agora deve estar livre para uso!")
    else:
        print(f"Nao foi possivel liberar a porta {port}.")

if __name__ == '__main__':
    main()
