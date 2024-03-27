
class Lead {
    private thickness: number;
    private hardness: string;
    private size: number;

    public constructor(calibre: number, dureza:string, tamanho: number) {
        this.thickness = calibre;
        this.hardness = dureza;
        this.size = tamanho;
    }

    public toString(): string {
        return `${this.thickness}:${this.hardness}:${this.size}`;
    }

    public usagePerSheet(): number {
        if (this.hardness === 'HB')
            return 1;
        if (this.hardness === '2B')
            return 2;
        if (this.hardness === '4B')
            return 4;
        return 6;
    }

    public getThickness(): number {
        return this.thickness;
    }

    public getHardness(): string {
        return this.hardness;
    }

    public getSize(): number {
        return this.size;
    }

    public setSize(size: number): void {
        this.size = size;
    }
}

class Pencil {
    //calibre
    private thickness: number;
    private tip: Lead | null; //lead da ponta
    private barrel: Array<Lead> = new Array<Lead>(); //grafites no cano

    public constructor(thickness: number) {
        this.thickness = thickness;
        this.tip = null;
        this.barrel = [];
    }

    public hasGrafite(): boolean{
        if(this.tip !== null){
            console.log("fail: ja existe grafite");
            return false;
        }
        return true;
    }

    public insert(lead: Lead): boolean {
        if(!this.hasGrafite()) {
            console.log("fail: nao existe grafite");
            return false;
        }
        if(this.thickness !== lead.getThickness()) {
            console.log("fail: calibre incompatível");
            return false;
        }
        /*push: 
         -adiciona um ou mais elementos ao final do array
         -retorna comprimento do novo array
        */
        this.barrel.push(lead);
        return true;
    }

    public remove(): Lead | null {
        if(!this.tip) {
            console.log("fail: nao existe grafite no bico");
            return null;
        }
        this.tip = null;
    }

    public pull(): boolean {
        if(this.barrel.length === 0) {
            console.log("fail: nao existe grafite no tambor");
            return false;
        }
        //pop: retorna e remove último elemento do array
        //shift: remove e retorna o primeiro elemento de um array
        const verificationShift = this.barrel.shift();
        if(verificationShift === undefined){
            return false;
        }
        if(this.tip !== null) {
            console.log("fail: ja existe grafite no bico");
            //push: adiciona elemento no final do array
            //unshift: adiciona elemento no início do array
            this.barrel.unshift(verificationShift);
            return false;
        } 
        this.tip = verificationShift;
        return true;
    }

    public writePage(): void {
        if(this.tip == null) {
            console.log("fail: nao existe grafite no bico");
            return;
        } else{
            const usagePerPage = this.tip.usagePerSheet();
            if(this.tip.getSize()  <= 10) {
                console.log("fail: tamanho insuficiente");
                return;
            } 
            if(this.tip.getSize() - usagePerPage < 10) {
                console.log("fail: folha incompleta");
                this.tip.setSize(10);
                return;
            } else {
                if(this.tip.getSize() < usagePerPage) {
                    console.log("fail: grafite insuficiente para escrever uma página");
                    return;
                }
                this.tip.setSize(this.tip.getSize() - usagePerPage);
            }
        }
    }
    public toString(): string {
        let saida =  "calibre: " + this.thickness + ", bico: " +
                (this.tip != null ? "[" + this.tip + "]" : "[]") + ", tambor: {";
        for(let g of this.barrel) {
            saida += "[" + g + "]";
        }  
        saida += "}";

        return saida;
    }
}

let _cin_ : string[] = [];
try { _cin_ = require("fs").readFileSync(0).toString().split(/\r?\n/); } catch(e){}
let input = () : string => _cin_.length === 0 ? "" : _cin_.shift()!;
let write = (text: any, end:string="\n")=> process.stdout.write("" + text + end);


function main() {
    let pencil = new Pencil(0.5);

    while (true) {
        let line = input();
        let args = line.split(" ");
        write("$" + line);

        if (args[0] == "end") {
            break;
        } else if (args[0] == "init") {
            pencil = new Pencil(+args[1]);
        } else if (args[0] == "insert") {
            pencil.insert(new Lead(+args[1], args[2], +args[3]));
        } else if (args[0] == "remove") {
            pencil.remove();
        } else if (args[0] == "pull") {
            pencil.pull();
        } else if (args[0] == "write") {
            pencil.writePage();
        } else if (args[0] == "show") {
            console.log(pencil.toString());
        } else {
            write("fail: comando invalido");
        }
    }
}

main()