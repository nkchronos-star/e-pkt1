import fs from 'fs';
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

code = code.replace(`           )}
           </div>
        </div>

      </form>
    </div>
  );
}`, `           )}
           </div>

      </form>
    </div>
  );
}`);

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
