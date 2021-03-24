"""empty message

Revision ID: f5a179271163
Revises: d13bcba02db0
Create Date: 2021-03-24 13:31:53.070957

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f5a179271163'
down_revision = 'd13bcba02db0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('is_active', sa.Boolean(), nullable=False))
    op.add_column('user', sa.Column('vet_user_fk', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'user', 'vet_user', ['vet_user_fk'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'user', type_='foreignkey')
    op.drop_column('user', 'vet_user_fk')
    op.drop_column('user', 'is_active')
    # ### end Alembic commands ###
